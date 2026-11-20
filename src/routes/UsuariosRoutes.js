const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/UsuariosController');
const { verificarToken, soloAdmin } = require('../middleware/AuthMiddleware');

router.get('/', verificarToken, soloAdmin, usuariosController.listar);
router.put('/:id', verificarToken, usuariosController.modificar);
router.patch('/:id/rol', verificarToken, soloAdmin, usuariosController.cambiarRol);
router.delete('/:id', verificarToken, soloAdmin, usuariosController.eliminar);

module.exports = router;