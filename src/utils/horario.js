const ZONA = 'America/Santiago';

// Clave = día de la semana (0 = domingo)
const HORARIO_ATENCION = {
  0: null,
  1: { apertura: 9, cierre: 19 },
  2: { apertura: 9, cierre: 19 },
  3: { apertura: 9, cierre: 19 },
  4: { apertura: 9, cierre: 19 },
  5: { apertura: 9, cierre: 19 },
  6: { apertura: 9, cierre: 14 },
};

const MINUTOS_DEL_BLOQUE = ['00', '30'];
const dosDigitos = (n) => String(n).padStart(2, '0');

// Fecha y hora actuales en Chile: { fecha: 'AAAA-MM-DD', hora: 'HH:MM' }
function ahoraEnChile(ahora = new Date()) {
  const partes = new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(ahora);
  const dato = (tipo) => partes.find((p) => p.type === tipo).value;
  return {
    fecha: `${dato('year')}-${dato('month')}-${dato('day')}`,
    hora: `${dato('hour')}:${dato('minute')}`,
  };
}

// 'AAAA-MM-DD' -> 0 (domingo) a 6 (sábado)
function diaDeLaSemana(fecha) {
  return new Date(`${fecha}T00:00:00Z`).getUTCDay();
}

// ¿Esa fecha y hora caen fuera del horario de atención?
function estaFueraDeHorario(fecha, hora) {
  const horario = HORARIO_ATENCION[diaDeLaSemana(fecha)];
  if (!horario) return true;
  const h = Number(String(hora).slice(0, 2));
  return h < horario.apertura || h >= horario.cierre;
}

// ¿Este mismo instante está fuera de horario?
function esFueraDeHorario(ahora = new Date()) {
  const { fecha, hora } = ahoraEnChile(ahora);
  return estaFueraDeHorario(fecha, hora);
}

// ocupadas: [{ fecha: 'AAAA-MM-DD', hora: 'HH:MM' o 'HH:MM:SS' }]
function estaOcupada(ocupadas, fecha, hora) {
  return (ocupadas || []).some(
    (c) => c.fecha === fecha && String(c.hora).slice(0, 5) === hora
  );
}

// Bloques de 30 min para una fecha: [{ valor, texto, deshabilitada }]
// Devuelve [] si es domingo, fecha pasada o inválida. Si es hoy, quita las horas que ya pasaron.
function horasDelDia(fecha, ocupadas) {
  const horario = HORARIO_ATENCION[diaDeLaSemana(fecha)];
  const hoy = ahoraEnChile();
  if (!horario || fecha < hoy.fecha) return [];

  const horas = [];
  for (let h = horario.apertura; h < horario.cierre; h++) {
    for (const min of MINUTOS_DEL_BLOQUE) {
      const valor = `${dosDigitos(h)}:${min}`;
      const ocupada = estaOcupada(ocupadas, fecha, valor);
      horas.push({ valor, texto: ocupada ? `${valor} (ocupada)` : valor, deshabilitada: ocupada });
    }
  }

  return fecha === hoy.fecha ? horas.filter((h) => h.valor > hoy.hora) : horas;
}

module.exports = {
  HORARIO_ATENCION, ahoraEnChile, diaDeLaSemana, estaFueraDeHorario,
  esFueraDeHorario, estaOcupada, horasDelDia,
};