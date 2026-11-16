const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verificarToken } = require('../middleware/auth.middleware');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "nombre": "Juan", "email": "juan@mail.com", "password": "1234" }
 *     responses:
 *       201: { description: Usuario creado }
 *       409: { description: Email ya existe }
 */
router.post('/register', authController.registrar);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "email": "juan@mail.com", "password": "1234" }
 *     responses:
 *       200: { description: JWT emitido }
 *       401: { description: Credenciales incorrectas }
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: Datos del usuario }
 *       401: { description: Token inválido }
 */
router.get('/me', verificarToken, authController.me);

module.exports = router;