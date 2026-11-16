require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

module.exports = app;