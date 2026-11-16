const Usuario = require('../models/usuario.model');

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
    const { id } = req.params;
    // Un usuario solo puede modificarse a sí mismo, salvo admin
    if (req.usuario.rol !== 'administrador' && req.usuario.sub !== parseInt(id))
      return res.status(403).json({ error: 'Sin permisos' });
    const [actualizado] = await Usuario.update(req.body, { where: { id } });
    if (!actualizado) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(200).json({ mensaje: 'Usuario actualizado' });
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

module.exports = { listar, modificar, eliminar };