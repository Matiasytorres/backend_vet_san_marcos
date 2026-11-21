const Servicio = require('../models/ServicioModel');
const { ErrorHttp } = require('../utils/errores');
const { textoEntre, lanzarSiHayErrores } = require('../dto/reglas');

const aDto = (s) => ({
  id: s.id, codigo: s.codigo, nombre: s.nombre, categoria: s.categoria,
  especie: s.especie, duracion: s.duracion,
  precio: s.precio, observaciones: s.observaciones,
});

const listar = async () => {
  const servicios = await Servicio.findAll({ order: [['nombre', 'ASC']] });
  return servicios.map(aDto);
};

const crear = async ({ nombre, categoria, especie, duracion, precio, observaciones } = {}) => {
  lanzarSiHayErrores([
    textoEntre(nombre, 'El nombre', 2, 100),
    textoEntre(categoria, 'La categoría', 2, 30),
    textoEntre(especie, 'La especie', 2, 40),
    textoEntre(duracion, 'La duración', 1, 20),
  ]);
  const total = await Servicio.count();
  const codigo = `SRV-${String(total + 1).padStart(3, '0')}`;
  const s = await Servicio.create({
    codigo,
    nombre: nombre.trim(),
    categoria: categoria.trim(),
    especie: especie.trim(),
    duracion: duracion.trim(),
    precio: Number(precio) || 0,
    observaciones: observaciones?.trim() || '',
  });
  return aDto(s);
};

const actualizar = async (id, { nombre, categoria, especie, duracion, precio, observaciones } = {}) => {
  const s = await Servicio.findByPk(id);
  if (!s) throw new ErrorHttp(404, 'Servicio no encontrado.');
  lanzarSiHayErrores([
    textoEntre(nombre, 'El nombre', 2, 100),
    textoEntre(categoria, 'La categoría', 2, 30),
    textoEntre(especie, 'La especie', 2, 40),
    textoEntre(duracion, 'La duración', 1, 20),
  ]);
  await s.update({
    nombre: nombre.trim(), categoria: categoria.trim(),
    especie: especie.trim(), duracion: duracion.trim(),
    precio: Number(precio) || 0,
    observaciones: observaciones?.trim() || '',
  });
  return aDto(s);
};

const eliminar = async (id) => {
  const s = await Servicio.findByPk(id);
  if (!s) throw new ErrorHttp(404, 'Servicio no encontrado.');
  await s.destroy();
};

module.exports = { listar, crear, actualizar, eliminar };