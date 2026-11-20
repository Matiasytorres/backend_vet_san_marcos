const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const Usuario = require('../models/UsuarioModel');
const { ErrorHttp } = require('../utils/errores');
const { textoEntre, emailValido, opcion, lanzarSiHayErrores } = require('../dto/reglas');

const ROLES = ['administrador', 'recepcionista', 'dueno_mascota'];
const ATRIBUTOS = ['id', 'nombre', 'email', 'rol', 'activo', 'createdAt'];

// DTO de salida: nunca incluye password_hash
const aDto = (u) => ({
  id: u.id,
  nombre: u.nombre,
  email: u.email,
  rol: u.rol,
  activo: u.activo,
  createdAt: u.createdAt,
});

function leerId(valor) {
  const id = Number(valor);
  if (!Number.isInteger(id) || id < 1) throw new ErrorHttp(400, 'El identificador no es válido.');
  return id;
}

// Un usuario solo accede a su propia cuenta. El administrador accede a todas.
function verificarAcceso(actor, id) {
  if (actor.rol !== 'administrador' && actor.sub !== id) {
    throw new ErrorHttp(403, 'No tienes permiso para acceder a este usuario.');
  }
}

async function buscarOFallar(id) {
  const usuario = await Usuario.findByPk(id, { attributes: ATRIBUTOS });
  if (!usuario) throw new ErrorHttp(404, 'Usuario no encontrado.');
  return usuario;
}

const listar = async () => {
  const usuarios = await Usuario.findAll({ attributes: ATRIBUTOS, order: [['id', 'ASC']] });
  return usuarios.map(aDto);
};

const crear = async ({ nombre, email, password, rol } = {}) => {
  lanzarSiHayErrores([
    textoEntre(nombre, 'El nombre', 2, 100),
    emailValido(email),
    typeof password === 'string' && password.length >= 6 && password.length <= 72
      ? ''
      : 'La contraseña debe tener entre 6 y 72 caracteres.',
    opcion(rol, 'El rol', ROLES),
  ]);

  const emailLimpio = email.trim().toLowerCase();
  if (await Usuario.findOne({ where: { email: emailLimpio } })) {
    throw new ErrorHttp(409, 'El email ya está registrado.');
  }

  const usuario = await Usuario.create({
    nombre: nombre.trim(),
    email: emailLimpio,
    password_hash: await bcrypt.hash(password, 12),
    rol,
  });
  return aDto(usuario);
};

const obtener = async (actor, idTexto) => {
  const id = leerId(idTexto);
  verificarAcceso(actor, id);
  return aDto(await buscarOFallar(id));
};

// Solo se aceptan nombre y email (lista blanca); cualquier otro campo se ignora
const modificar = async (actor, idTexto, { nombre, email } = {}) => {
  const id = leerId(idTexto);
  verificarAcceso(actor, id);

  const cambios = {};
  const errores = [];
  if (nombre !== undefined) {
    errores.push(textoEntre(nombre, 'El nombre', 2, 100));
    cambios.nombre = String(nombre).trim();
  }
  if (email !== undefined) {
    errores.push(emailValido(email));
    cambios.email = String(email).trim().toLowerCase();
  }
  lanzarSiHayErrores(errores);
  if (Object.keys(cambios).length === 0) {
    throw new ErrorHttp(400, 'Debes enviar nombre o email.');
  }

  const usuario = await buscarOFallar(id);

  if (cambios.email) {
    const repetido = await Usuario.findOne({
      where: { email: cambios.email, id: { [Op.ne]: id } },
    });
    if (repetido) throw new ErrorHttp(409, 'El email ya está registrado.');
  }

  await usuario.update(cambios);
  return aDto(usuario);
};

const cambiarRol = async (actor, idTexto, rol) => {
  const id = leerId(idTexto);
  lanzarSiHayErrores([opcion(rol, 'El rol', ROLES)]);
  if (id === actor.sub) throw new ErrorHttp(409, 'No puedes cambiar tu propio rol.');

  const usuario = await buscarOFallar(id);
  await usuario.update({ rol });
  return aDto(usuario);
};

// Desactivar = eliminación lógica: el registro queda, pero ya no puede iniciar sesión
const cambiarEstado = async (actor, idTexto, activo) => {
  const id = leerId(idTexto);
  lanzarSiHayErrores([typeof activo === 'boolean' ? '' : 'El campo activo debe ser true o false.']);
  if (id === actor.sub && activo === false) {
    throw new ErrorHttp(409, 'No puedes desactivar tu propia cuenta.');
  }

  const usuario = await buscarOFallar(id);
  await usuario.update({ activo });
  return aDto(usuario);
};

module.exports = { listar, crear, obtener, modificar, cambiarRol, cambiarEstado };