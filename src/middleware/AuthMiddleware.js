const jwt = require('jsonwebtoken');
const Usuario = require('../models/UsuarioModel');
const { ErrorHttp } = require('../utils/errores');

// 401 si falta el token, es inválido, alterado o vencido, o si la cuenta ya no está activa
const verificarToken = async (req, res, next) => {
  const [tipo, token] = (req.headers['authorization'] || '').split(' ');
  if (tipo !== 'Bearer' || !token) throw new ErrorHttp(401, 'Token requerido.');

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'vet-san-marcos',
      audience: 'vet-frontend',
      algorithms: ['HS256'],
    });
  } catch {
    throw new ErrorHttp(401, 'Token inválido o vencido.');
  }

  // El rol y el estado se leen de la base, no del token
  const usuario = await Usuario.findOne({
    where: { id: payload.sub, activo: true },
    attributes: ['id', 'rol', 'email'],
  });
  if (!usuario) throw new ErrorHttp(401, 'Sesión no válida.');

  req.usuario = { sub: usuario.id, rol: usuario.rol, email: usuario.email };
  next();
};

// 403 si el rol no está en la lista. Uso: permitirRoles('administrador', 'recepcionista')
const permitirRoles = (...roles) => (req, res, next) => {
  if (!req.usuario || !roles.includes(req.usuario.rol)) {
    throw new ErrorHttp(403, 'No tienes permiso para esta acción.');
  }
  next();
};

const soloAdmin = permitirRoles('administrador');

module.exports = { verificarToken, permitirRoles, soloAdmin };