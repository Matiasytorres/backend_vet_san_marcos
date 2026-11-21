const serviciosService = require('../services/ServiciosService');

const listar = async (req, res, next) => {
  try {
    res.status(200).json(await serviciosService.listar());
  } catch (e) { next(e); }
};
const crear = async (req, res, next) => {
  try {
    res.status(201).json(await serviciosService.crear(req.body));
  } catch (e) { next(e); }
};
const actualizar = async (req, res, next) => {
  try {
    res.status(200).json(await serviciosService.actualizar(req.params.id, req.body));
  } catch (e) { next(e); }
};
const eliminar = async (req, res, next) => {
  try {
    await serviciosService.eliminar(req.params.id);
    res.status(204).send();
  } catch (e) { next(e); }
};

module.exports = { listar, crear, actualizar, eliminar };