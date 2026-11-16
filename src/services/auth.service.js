const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const registrar = async ({ nombre, email, password, rol }) => {
  const existe = await Usuario.findOne({ where: { email } });
  if (existe) throw { status: 409, message: 'El email ya está registrado' };

  const password_hash = await bcrypt.hash(password, 12);
  const rolFinal = rol === 'administrador' ? 'dueno_mascota' : (rol || 'dueno_mascota');

  const usuario = await Usuario.create({ nombre, email, password_hash, rol: rolFinal });
  const { password_hash: _, ...datos } = usuario.toJSON();
  return datos;
};

const login = async ({ email, password }) => {
  const usuario = await Usuario.findOne({ where: { email, activo: true } });
  if (!usuario) throw { status: 401, message: 'Credenciales incorrectas' };

  const valido = await bcrypt.compare(password, usuario.password_hash);
  if (!valido) throw { status: 401, message: 'Credenciales incorrectas' };

  const token = jwt.sign(
    { sub: usuario.id, rol: usuario.rol, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN, issuer: 'vet-san-marcos', audience: 'vet-frontend' }
  );
  return { accessToken: token, tipo: 'Bearer', expira: process.env.JWT_EXPIRES_IN };
};

module.exports = { registrar, login };