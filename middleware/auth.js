const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) { //Checks if the Authorization header
    return res.status(401).json({
      error: 'Authorization token missing or malformed'
    });
  }

  const token = authHeader.split(' ')[1]; //Extracts token from the Header text

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