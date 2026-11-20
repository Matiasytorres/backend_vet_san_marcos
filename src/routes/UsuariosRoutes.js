const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/UsuariosController');
const { verificarToken, soloAdmin } = require('../middleware/AuthMiddleware');

/**
 * @swagger
 * /api/v1/usuarios:
 *   get:
 *     summary: Listar usuarios (solo administrador)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: "Lista de usuarios sin contraseñas" }
 *       401: { description: "Token ausente, alterado o vencido" }
 *       403: { description: "Rol insuficiente" }
 *   post:
 *     summary: Crear un usuario con el rol indicado (solo administrador)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "nombre": "Valentina Muñoz", "email": "valentina@vet.cl", "password": "Clave1234", "rol": "recepcionista" }
 *     responses:
 *       201: { description: "Usuario creado" }
 *       400: { description: "Datos inválidos (detalles en el cuerpo)" }
 *       401: { description: "Token ausente, alterado o vencido" }
 *       403: { description: "Rol insuficiente" }
 *       409: { description: "El email ya está registrado" }
 */
router.get('/', verificarToken, soloAdmin, usuariosController.listar);
router.post('/', verificarToken, soloAdmin, usuariosController.crear);

/**
 * @swagger
 * /api/v1/usuarios/{id}:
 *   parameters:
 *     - { in: path, name: id, required: true, schema: { type: integer }, example: 1 }
 *   get:
 *     summary: Ver un usuario (el propio, o cualquiera si eres administrador)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200: { description: "Datos del usuario" }
 *       400: { description: "Identificador inválido" }
 *       401: { description: "Token ausente, alterado o vencido" }
 *       403: { description: "Intentas ver la cuenta de otra persona" }
 *       404: { description: "Usuario no encontrado" }
 *   put:
 *     summary: Modificar nombre y email (el propio, o cualquiera si eres administrador)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "nombre": "Juan Pérez", "email": "juan.nuevo@mail.com" }
 *     responses:
 *       200: { description: "Usuario actualizado" }
 *       400: { description: "Datos inválidos" }
 *       401: { description: "Token ausente, alterado o vencido" }
 *       403: { description: "Intentas modificar la cuenta de otra persona" }
 *       404: { description: "Usuario no encontrado" }
 *       409: { description: "El email ya está registrado" }
 *   delete:
 *     summary: Desactivar un usuario (eliminación lógica, solo administrador)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204: { description: "Usuario desactivado" }
 *       401: { description: "Token ausente, alterado o vencido" }
 *       403: { description: "Rol insuficiente" }
 *       404: { description: "Usuario no encontrado" }
 *       409: { description: "No puedes desactivar tu propia cuenta" }
 */
router.get('/:id', verificarToken, usuariosController.obtener);
router.put('/:id', verificarToken, usuariosController.modificar);
router.delete('/:id', verificarToken, soloAdmin, usuariosController.desactivar);

/**
 * @swagger
 * /api/v1/usuarios/{id}/rol:
 *   patch:
 *     summary: Cambiar el rol de un usuario (solo administrador)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer }, example: 2 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "rol": "recepcionista" }
 *     responses:
 *       200: { description: "Rol actualizado" }
 *       400: { description: "Rol inválido" }
 *       401: { description: "Token ausente, alterado o vencido" }
 *       403: { description: "Rol insuficiente" }
 *       404: { description: "Usuario no encontrado" }
 *       409: { description: "No puedes cambiar tu propio rol" }
 */
router.patch('/:id/rol', verificarToken, soloAdmin, usuariosController.cambiarRol);

/**
 * @swagger
 * /api/v1/usuarios/{id}/estado:
 *   patch:
 *     summary: Activar o desactivar un usuario (solo administrador)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - { in: path, name: id, required: true, schema: { type: integer }, example: 2 }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example: { "activo": true }
 *     responses:
 *       200: { description: "Estado actualizado" }
 *       400: { description: "El campo activo debe ser true o false" }
 *       401: { description: "Token ausente, alterado o vencido" }
 *       403: { description: "Rol insuficiente" }
 *       404: { description: "Usuario no encontrado" }
 *       409: { description: "No puedes desactivar tu propia cuenta" }
 */
router.patch('/:id/estado', verificarToken, soloAdmin, usuariosController.cambiarEstado);

module.exports = router;