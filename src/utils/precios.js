const { estaFueraDeHorario, esFueraDeHorario } = require('./horario');

const RECARGO_FUERA_DE_HORARIO = 10000;

// Servicios que cobran recargo fuera de horario (por ahora, la consulta de urgencia)
const SERVICIOS_CON_RECARGO = ['SV002'];

const tieneRecargoFueraDeHorario = (servicio) => SERVICIOS_CON_RECARGO.includes(servicio.codigo);

// Precio final. Si das fecha ('AAAA-MM-DD') y hora ('HH:MM') de la cita, se usan;
// si no, se usa el momento actual. Ej: SV002 fuera de horario -> 25000 + 10000 = 35000
function calcularPrecioServicio(servicio, fecha, hora) {
  const base = Number(servicio.precio);
  if (!tieneRecargoFueraDeHorario(servicio)) return base;

  const fuera = fecha && hora ? estaFueraDeHorario(fecha, hora) : esFueraDeHorario();
  return fuera ? base + RECARGO_FUERA_DE_HORARIO : base;
}

module.exports = { RECARGO_FUERA_DE_HORARIO, tieneRecargoFueraDeHorario, calcularPrecioServicio };