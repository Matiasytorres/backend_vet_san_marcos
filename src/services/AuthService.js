const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/UsuarioModel');
const { ErrorHttp } = require('../utils/errores');
const { textoEntre, emailValido, lanzarSiHayErrores } = require('../dto/reglas');

const registrar = async ({ nombre, email, password } = {}) => {
  lanzarSiHayErrores([
    textoEntre(nombre, 'El nombre', 2, 100),
    emailValido(email),
    typeof password === 'string' && password.length >= 6 && password.length <= 72
      ? ''
      : 'La contraseña debe tener entre 6 y 72 caracteres.',
  ]);

  const emailLimpio = email.trim().toLowerCase();
  const existe = await Usuario.findOne({ where: { email: emailLimpio } });
  if (existe) throw new ErrorHttp(409, 'El email ya está registrado.');

  const password_hash = await bcrypt.hash(password, 12);

  // El rol lo decide el servidor, nunca el cliente
  const usuario = await Usuario.create({
    nombre: nombre.trim(),
    email: emailLimpio,
    password_hash,
    rol: 'dueno_mascota',
  });

  // DTO de salida: solo estos campos viajan al cliente
  return { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol };
};

const login = async ({ email, password } = {}) => {
  lanzarSiHayErrores([
    typeof email === 'string' && email.trim() ? '' : 'El correo es obligatorio.',
    typeof password === 'string' && password ? '' : 'La contraseña es obligatoria.',
  ]);

  const usuario = await Usuario.findOne({
    where: { email: email.trim().toLowerCase(), activo: true },
  });
  // Mismo mensaje en ambos casos: no revela si la cuenta existe
  if (!usuario) throw new ErrorHttp(401, 'Credenciales incorrectas.');

  const valido = await bcrypt.compare(password, usuario.password_hash);
  if (!valido) throw new ErrorHttp(401, 'Credenciales incorrectas.');

  const token = jwt.sign(
    { sub: usuario.id, rol: usuario.rol, email: usuario.email },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
      issuer: 'vet-san-marcos',
      audience: 'vet-frontend',
      algorithm: 'HS256',
    }
  );
  return { accessToken: token, tipo: 'Bearer', expira: process.env.JWT_EXPIRES_IN };
};

// Perfil leído desde la base (no desde lo que diga el token)
const obtenerPerfil = async (id) => {
  const usuario = await Usuario.findOne({
    where: { id, activo: true },
    attributes: ['id', 'nombre', 'email', 'rol'],
  });
  if (!usuario) throw new ErrorHttp(401, 'Sesión no válida.');
  return usuario;
};

module.exports = { registrar, login, obtenerPerfil };