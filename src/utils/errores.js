// Error con estado HTTP. Se lanza con: throw new ErrorHttp(404, 'No existe.')
class ErrorHttp extends Error {
  constructor(status, mensaje, detalles = []) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

module.exports = { ErrorHttp };