const jwt = require('jsonwebtoken');

//const JWT_SECRET = 'your-super-secret-key-change-this-in-production';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  //const token = authHeader && authHeader.split(' ')[1];

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authorization token missing or malformed'
    });
  }

  const token = authHeader.split(' ')[1];

  // if (!token) {
  //   return res.status(401).json({ error: 'No token provided. Please log in.' });
  // }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
      if (err.name === 'TokenExpiredError') {
      return res.status(403).json({
        error: 'Session expired. Please log in again.'
      });
    }
    return res.status(403).json({
      error: 'Invalid token'
    });
  }
}

module.exports = { requireAuth };