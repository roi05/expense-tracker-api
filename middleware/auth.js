const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, return an error
  if (!token) {
    return res.status(401).json({ error: 'Missing token' });
  }

  try {
    // Verify the token with the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Add the user ID to the request object
    req.user = decoded.userId;

    // Call the next middleware
    next();
  } catch (err) {
    // If the token is invalid, return an error
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = { authMiddleware };
