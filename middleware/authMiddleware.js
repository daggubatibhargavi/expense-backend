const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from header 'Authorization: Bearer <token>'
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;  // Assuming your JWT payload contains { user: { id: ... } }
    next(); // pass control to next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
