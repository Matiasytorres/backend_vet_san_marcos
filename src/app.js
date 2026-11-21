require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { swaggerUi, specs } = require('./config/swagger');
const { manejarErrores, rutaNoEncontrada } = require('./middleware/ErrorMiddleware');
const authRoutes = require('./routes/AuthRoutes');
const usuariosRoutes = require('./routes/UsuariosRoutes');
const serviciosRoutes = require('./routes/ServiciosRoutes');
const mascotasRoutes = require('./routes/MascotasRoutes');
const citasRoutes = require('./routes/CitasRoutes');

const app = express();

app.use(cors());
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