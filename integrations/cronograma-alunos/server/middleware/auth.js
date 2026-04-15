const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.nivel)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
};

module.exports = { authenticateToken, checkRole };