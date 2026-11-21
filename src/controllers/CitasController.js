const citasService = require('../services/CitasService');

const listar = async (req, res) => {
  res.status(200).json(await citasService.listar(req.usuario));
};

const crear = async (req, res) => {
  res.status(201).json(await citasService.crear(req.usuario, req.body));
};

const cambiarEstado = async (req, res) => {
  res.status(200).json(await citasService.cambiarEstado(req.usuario, req.params.id, req.body?.estado));
};

const listarOcupadas = async (req, res) => {
  res.status(200).json(await citasService.listarOcupadas());
};

module.exports = { listar, crear, cambiarEstado, listarOcupadas };