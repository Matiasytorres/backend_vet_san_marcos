require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { swaggerUi, specs } = require('./config/swagger');
const { manejarErrores, rutaNoEncontrada } = require('./middleware/error.middleware');
const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const serviciosRoutes = require('./routes/servicios.routes');
const mascotasRoutes = require('./routes/mascotas.routes');
const citasRoutes = require('./routes/citas.routes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/api/v1/health', (req, res) => res.status(200).json({ estado: 'ok' }));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usuarios', usuariosRoutes);
app.use('/api/v1/servicios', serviciosRoutes);
app.use('/api/v1/mascotas', mascotasRoutes);
app.use('/api/v1/citas', citasRoutes);

// Siempre al final
app.use(rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;