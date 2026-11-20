const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cita = sequelize.define('Cita', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  fecha: { type: DataTypes.DATEONLY, allowNull: false },
  hora: { type: DataTypes.TIME, allowNull: false },
  estado: { type: DataTypes.STRING(12), allowNull: false, defaultValue: 'Pendiente' },
  motivo: { type: DataTypes.STRING(300), allowNull: false, defaultValue: '' },
  precio_final: { type: DataTypes.INTEGER, allowNull: false },
  mascota_id: { type: DataTypes.INTEGER, allowNull: false },
  servicio_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'citas', timestamps: true });

module.exports = Cita;