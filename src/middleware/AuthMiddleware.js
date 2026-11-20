const jwt = require('jsonwebtoken');
const { ErrorHttp } = require('../utils/errores');

// 401 si falta el token o es inválido, alterado o vencido
const verificarToken = (req, res, next) => {
  const [tipo, token] = (req.headers['authorization'] || '').split(' ');
  if (tipo !== 'Bearer' || !token) throw new ErrorHttp(401, 'Token requerido.');

  try {
    req.usuario = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'vet-san-marcos',
      audience: 'vet-frontend',
      algorithms: ['HS256'],
    });
  } catch {
    throw new ErrorHttp(401, 'Token inválido o vencido.');
  }
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