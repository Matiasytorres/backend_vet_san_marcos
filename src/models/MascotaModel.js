const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mascota = sequelize.define('Mascota', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nombre: { type: DataTypes.STRING(60), allowNull: false },
  especie: { type: DataTypes.STRING(20), allowNull: false },
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
}, { tableName: 'mascotas', timestamps: true });

module.exports = Mascota;