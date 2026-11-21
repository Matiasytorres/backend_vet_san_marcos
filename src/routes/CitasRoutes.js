const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/CitasController');
const { verificarToken, permitirRoles } = require('../middleware/AuthMiddleware');

router.get('/ocupadas', ctrl.listarOcupadas);

router.get('/', verificarToken, ctrl.listar);

router.post('/', verificarToken, ctrl.crear);

router.patch('/:id/estado', verificarToken, permitirRoles('administrador', 'recepcionista'), ctrl.cambiarEstado);

module.exports = router;