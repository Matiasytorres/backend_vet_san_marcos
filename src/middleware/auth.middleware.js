const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token requerido' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'vet-san-marcos',
      audience: 'vet-frontend'
    });
    req.usuario = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido o vencido' });
  }
};

const soloAdmin = (req, res, next) => {
  if (req.usuario?.rol !== 'administrador')
    return res.status(403).json({ error: 'Se requiere rol administrador' });
  next();
};

module.exports = { verificarToken, soloAdmin };