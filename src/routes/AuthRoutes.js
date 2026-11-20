const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const { verificarToken } = require('../middleware/AuthMiddleware');

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Registrar nuevo usuario (el servidor le asigna siempre el rol dueño de mascota)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "nombre": "Juan Pérez", "email": "juan@mail.com", "password": "Clave1234" }
 *     responses:
 *       201: { description: "Usuario creado (sin contraseña ni hash)" }
 *       400: { description: "Datos inválidos (detalles en el cuerpo)" }
 *       409: { description: "El email ya está registrado" }
 */
router.post('/register', authController.registrar);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "email": "juan@mail.com", "password": "Clave1234" }
 *     responses:
 *       200: { description: "Token JWT con vigencia (accessToken, tipo y expira)" }
 *       400: { description: "Faltan datos" }
 *       401: { description: "Credenciales incorrectas (mensaje genérico)" }
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Obtener el usuario autenticado (leído desde la base de datos)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: "Datos del usuario" }
 *       401: { description: "Token ausente, alterado o vencido" }
 */
router.get('/me', verificarToken, authController.me);

module.exports = router;