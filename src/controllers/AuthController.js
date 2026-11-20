const authService = require('../services/AuthService');

const registrar = async (req, res) => {
  try {
    const datos = await authService.registrar(req.body);
    res.status(201).json(datos);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

const login = async (req, res) => {
  try {
    const resultado = await authService.login(req.body);
    res.status(200).json(resultado);
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message });
  }
};

const me = (req, res) => {
  res.status(200).json({ usuario: req.usuario });
};

module.exports = { registrar, login, me };