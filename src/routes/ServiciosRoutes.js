const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ServiciosController');
const { verificarToken, soloAdmin } = require('../middleware/AuthMiddleware');

router.get('/', ctrl.listar);
router.post('/', verificarToken, soloAdmin, ctrl.crear);
router.put('/:id', verificarToken, soloAdmin, ctrl.actualizar);
router.delete('/:id', verificarToken, soloAdmin, ctrl.eliminar);

module.exports = router;