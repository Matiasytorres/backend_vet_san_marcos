const rutaNoEncontrada = (req, res) =>
  res.status(404).json({ mensaje: 'Ruta no encontrada.', detalles: [] });

// Debe registrarse al final de app.js (4 parámetros)
const manejarErrores = (err, req, res, next) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({ mensaje: 'Ya existe un registro con esos datos.', detalles: [] });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    const sigueReferenciado = String(err.parent?.detail || '').includes('still referenced');
    return sigueReferenciado
      ? res.status(409).json({ mensaje: 'No se puede eliminar: hay datos relacionados.', detalles: [] })
      : res.status(400).json({ mensaje: 'Un dato relacionado no existe.', detalles: [] });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El cuerpo de la solicitud no es un JSON válido.', detalles: [] });
  }

  const status = err.status || 500;
  if (status >= 500) console.error(err);

  res.status(status).json({
    mensaje: status >= 500 ? 'Error interno del servidor.' : err.message,
    detalles: err.detalles || [],
  });
};

module.exports = { manejarErrores, rutaNoEncontrada };