const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Servicio = sequelize.define('Servicio', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  codigo: { type: DataTypes.STRING(10), allowNull: false, unique: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  categoria: { type: DataTypes.STRING(30), allowNull: false },
  especie: { type: DataTypes.STRING(40), allowNull: false },
  duracion: { type: DataTypes.STRING(20), allowNull: false },
  precio: { type: DataTypes.INTEGER, allowNull: false },
  observaciones: { type: DataTypes.STRING(200), allowNull: false, defaultValue: '' },
}, { tableName: 'servicios', timestamps: true });

module.exports = Servicio;