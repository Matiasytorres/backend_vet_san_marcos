const { ErrorHttp } = require('../utils/errores');

const textoEntre = (valor, nombre, min, max) => {
  const largo = typeof valor === 'string' ? valor.trim().length : 0;
  return largo < min || largo > max ? `${nombre} debe tener entre ${min} y ${max} caracteres.` : '';
};

const enteroEntre = (valor, nombre, min, max) =>
  Number.isInteger(valor) && valor >= min && valor <= max
    ? ''
    : `${nombre} debe ser un entero entre ${min} y ${max}.`;

const opcion = (valor, nombre, opciones) =>
  opciones.includes(valor) ? '' : `${nombre} debe ser uno de: ${opciones.join(', ')}.`;

const emailValido = (valor) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor ?? '').trim())
    ? ''
    : 'El correo no tiene un formato válido.';

const fechaValida = (valor, nombre = 'La fecha') => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(valor ?? ''));
  if (!m) return `${nombre} debe tener formato AAAA-MM-DD.`;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  const existe =
    d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
  return existe ? '' : `${nombre} no existe en el calendario.`;
};

const horaValida = (valor, nombre = 'La hora') =>
  /^([01]\d|2[0-3]):[0-5]\d$/.test(String(valor ?? '')) ? '' : `${nombre} debe tener formato HH:MM.`;

// Si hay errores, responde 400 con la lista
const lanzarSiHayErrores = (detalles) => {
  const lista = detalles.filter(Boolean);
  if (lista.length > 0) throw new ErrorHttp(400, 'Los datos enviados no son válidos.', lista);
};

module.exports = {
  textoEntre, enteroEntre, opcion, emailValido, fechaValida, horaValida, lanzarSiHayErrores,
};