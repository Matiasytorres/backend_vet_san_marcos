const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
//  telefono: { type: DataTypes.STRING(20), allowNull: true }, no se activa hasta ejecutar schema.sql en la base de datos
  password_hash: { type: DataTypes.STRING, allowNull: false },
  rol: { type: DataTypes.ENUM('administrador', 'recepcionista', 'dueno_mascota'), defaultValue: 'dueno_mascota' },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'usuarios', timestamps: true });

module.exports = Usuario;