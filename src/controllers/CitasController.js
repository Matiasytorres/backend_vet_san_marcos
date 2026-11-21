const citasService = require('../services/CitasService');

const listar = async (req, res, next) => {
  try { res.status(200).json(await citasService.listar(req.usuario)); }
  catch (e) { next(e); }
};
const crear = async (req, res, next) => {
  try { res.status(201).json(await citasService.crear(req.usuario, req.body)); }
  catch (e) { next(e); }
};
const cambiarEstado = async (req, res, next) => {
  try { res.status(200).json(await citasService.cambiarEstado(req.usuario, req.params.id, req.body?.estado)); }
  catch (e) { next(e); }
};
const listarOcupadas = async (req, res, next) => {
  try { res.status(200).json(await citasService.listarOcupadas()); }
  catch (e) { next(e); }
};

module.exports = { listar, crear, cambiarEstado, listarOcupadas };