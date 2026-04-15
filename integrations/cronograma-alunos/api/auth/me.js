const jwt = require('jsonwebtoken');

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user });
  } catch (err) {
    res.status(403).json({ error: 'Token inválido' });
  }
}