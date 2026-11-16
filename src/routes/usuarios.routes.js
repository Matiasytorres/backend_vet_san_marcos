const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');
const { verificarToken, soloAdmin } = require('../middleware/auth.middleware');

router.get('/', verificarToken, soloAdmin, usuariosController.listar);
router.put('/:id', verificarToken, usuariosController.modificar);
router.delete('/:id', verificarToken, soloAdmin, usuariosController.eliminar);

module.exports = router;