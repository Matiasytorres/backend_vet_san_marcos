const Usuario = require('../models/UsuarioModel');

const ROLES_VALIDOS = ['administrador', 'recepcionista', 'dueno_mascota'];

const listar = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ attributes: { exclude: ['password_hash'] } });
    res.status(200).json(usuarios);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const modificar = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (req.usuario.rol !== 'administrador' && req.usuario.sub !== id)
      return res.status(403).json({ error: 'Sin permisos' });

    const { nombre, email } = req.body;
    const cambios = {};
    if (nombre !== undefined) cambios.nombre = nombre;
    if (email !== undefined) cambios.email = email;

    if (Object.keys(cambios).length === 0)
      return res.status(400).json({ error: 'Debes enviar nombre o email' });

    const [actualizado] = await Usuario.update(cambios, { where: { id } });
    if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(200).json({ mensaje: 'Usuario actualizado' });
  } catch (e) {
    if (e.name === 'SequelizeUniqueConstraintError')
      return res.status(409).json({ error: 'El email ya está registrado' });
    res.status(500).json({ error: e.message });
  }
};

const cambiarRol = async (req, res) => {
  try {
    const { rol } = req.body;
    if (!ROLES_VALIDOS.includes(rol))
      return res.status(400).json({ error: 'Rol inválido' });

    const [actualizado] = await Usuario.update({ rol }, { where: { id: req.params.id } });
    if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(200).json({ mensaje: 'Rol actualizado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.destroy({ where: { id } });
    if (!eliminado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(200).json({ mensaje: 'Usuario eliminado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

module.exports = { listar, modificar, cambiarRol, eliminar };