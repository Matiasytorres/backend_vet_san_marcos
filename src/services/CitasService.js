const { Cita, Mascota, Servicio, Usuario } = require('../models/index');
const { ErrorHttp } = require('../utils/errores');
const { lanzarSiHayErrores, textoEntre, fechaValida, horaValida } = require('../dto/reglas');

const aDto = (c) => ({
  id: c.id,
  fecha: c.fecha,
  hora: c.hora,
  estado: c.estado,
  motivo: c.motivo,
  precio_final: c.precio_final,
  mascota: c.mascota ? { id: c.mascota.id, nombre: c.mascota.nombre, especie: c.mascota.especie } : null,
  servicio: c.servicio ? { id: c.servicio.id, codigo: c.servicio.codigo, nombre: c.servicio.nombre } : null,
});

const incluir = [
  { model: Mascota, as: 'mascota', attributes: ['id', 'nombre', 'especie'] },
  { model: Servicio, as: 'servicio', attributes: ['id', 'codigo', 'nombre'] },
];

const listar = async (actor) => {
  const where = actor.rol === 'dueno_mascota'
    ? { '$mascota.usuario_id$': actor.sub }
    : {};
  const citas = await Cita.findAll({
    where,
    include: incluir,
    order: [['fecha', 'DESC'], ['hora', 'DESC']],
  });
  return citas.map(aDto);
};

const crear = async (actor, { mascota_nombre, especie, servicio_codigo, fecha, hora, motivo } = {}) => {
  lanzarSiHayErrores([
    textoEntre(mascota_nombre, 'El nombre de la mascota', 1, 60),
    textoEntre(especie, 'La especie', 1, 40),
    textoEntre(servicio_codigo, 'El servicio', 1, 20),
    fechaValida(fecha),
    horaValida(hora),
  ]);

  const servicio = await Servicio.findOne({ where: { codigo: servicio_codigo } });
  if (!servicio) throw new ErrorHttp(404, 'Servicio no encontrado.');

  const conflicto = await Cita.findOne({ where: { fecha, hora } });
  if (conflicto) throw new ErrorHttp(409, 'Ya existe una cita en ese horario. Elige otra hora.');

  let mascota = await Mascota.findOne({
    where: { nombre: mascota_nombre.trim(), usuario_id: actor.sub },
  });
  if (!mascota) {
    mascota = await Mascota.create({
      nombre: mascota_nombre.trim(),
      especie: especie.trim(),
      usuario_id: actor.sub,
    });
  }

  const cita = await Cita.create({
    fecha,
    hora,
    estado: 'Pendiente',
    motivo: motivo?.trim() || '',
    precio_final: servicio.precio,
    mascota_id: mascota.id,
    servicio_id: servicio.id,
  });

  return aDto(await Cita.findByPk(cita.id, { include: incluir }));
};

const cambiarEstado = async (actor, id, estado) => {
  const ESTADOS = ['Pendiente', 'Confirmada', 'Cancelada', 'Completada'];
  if (!ESTADOS.includes(estado)) throw new ErrorHttp(400, `Estado inválido. Usa: ${ESTADOS.join(', ')}`);

  const cita = await Cita.findByPk(id, { include: incluir });
  if (!cita) throw new ErrorHttp(404, 'Cita no encontrada.');

  // Solo admin/recepcionista puede confirmar o completar
  if (['Confirmada', 'Completada'].includes(estado) && actor.rol === 'dueno_mascota') {
    throw new ErrorHttp(403, 'No tienes permiso para ese cambio de estado.');
  }

  await cita.update({ estado });
  return aDto(cita);
};

const listarOcupadas = async () => {
  const citas = await Cita.findAll({
    where: { estado: ['Pendiente', 'Confirmada'] },
    attributes: ['fecha', 'hora'],
  });
  return citas.map((c) => ({ fecha: c.fecha, hora: c.hora }));
};

module.exports = { listar, crear, cambiarEstado, listarOcupadas };