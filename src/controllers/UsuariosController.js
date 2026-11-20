const usuariosService = require('../services/UsuariosService');

const listar = async (req, res) => {
  res.status(200).json(await usuariosService.listar());
};

const crear = async (req, res) => {
  res.status(201).json(await usuariosService.crear(req.body));
};

const obtener = async (req, res) => {
  res.status(200).json(await usuariosService.obtener(req.usuario, req.params.id));
};

const modificar = async (req, res) => {
  res.status(200).json(await usuariosService.modificar(req.usuario, req.params.id, req.body));
};

const cambiarRol = async (req, res) => {
  res.status(200).json(await usuariosService.cambiarRol(req.usuario, req.params.id, req.body?.rol));
};

const cambiarEstado = async (req, res) => {
  res.status(200).json(
    await usuariosService.cambiarEstado(req.usuario, req.params.id, req.body?.activo)
  );
};

// DELETE desactiva la cuenta (eliminación lógica) y responde 204 sin cuerpo
const desactivar = async (req, res) => {
  await usuariosService.cambiarEstado(req.usuario, req.params.id, false);
  res.status(204).send();
};

module.exports = { listar, crear, obtener, modificar, cambiarRol, cambiarEstado, desactivar };