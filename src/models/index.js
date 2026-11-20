const sequelize = require('../config/database');
const Usuario = require('./UsuarioModel');
const Servicio = require('./ServicioModel');
const Mascota = require('./MascotaModel');
const Cita = require('./CitaModel');

// Un dueño tiene muchas mascotas
Usuario.hasMany(Mascota, { foreignKey: 'usuario_id', as: 'mascotas' });
Mascota.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'duenio' });

// Una mascota tiene muchas citas
Mascota.hasMany(Cita, { foreignKey: 'mascota_id', as: 'citas' });
Cita.belongsTo(Mascota, { foreignKey: 'mascota_id', as: 'mascota' });

// Un servicio aparece en muchas citas
Servicio.hasMany(Cita, { foreignKey: 'servicio_id', as: 'citas' });
Cita.belongsTo(Servicio, { foreignKey: 'servicio_id', as: 'servicio' });

module.exports = { sequelize, Usuario, Servicio, Mascota, Cita };