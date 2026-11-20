const authService = require('../services/auth.service');

const registrar = async (req, res) => {
  const datos = await authService.registrar(req.body);
  res.status(201).json(datos);
};

const login = async (req, res) => {
  const resultado = await authService.login(req.body);
  res.status(200).json(resultado);
};

const me = async (req, res) => {
  const usuario = await authService.obtenerPerfil(req.usuario.sub);
  res.status(200).json({ usuario });
};

module.exports = { registrar, login, me };