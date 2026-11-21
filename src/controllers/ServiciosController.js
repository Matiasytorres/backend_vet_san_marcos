const serviciosService = require('../services/ServiciosService');

const listar = async (req, res) => {
  res.status(200).json(await serviciosService.listar());
};
const crear = async (req, res) => {
  res.status(201).json(await serviciosService.crear(req.body));
};
const actualizar = async (req, res) => {
  res.status(200).json(await serviciosService.actualizar(req.params.id, req.body));
};
const eliminar = async (req, res) => {
  await serviciosService.eliminar(req.params.id);
  res.status(204).send();
};

module.exports = { listar, crear, actualizar, eliminar };