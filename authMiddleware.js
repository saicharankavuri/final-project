// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('./models/userModel');

async function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) return res.sendStatus(401);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;

    // Check token expiration
    const currentTimestamp = Math.floor(Date.now() / 1000); // Get current time in seconds
    if (user.exp < currentTimestamp) {
      return res.status(401).json({ error: 'Token has expired. Please sign in again.' });
    }

    next();
  } catch (error) {
    res.sendStatus(403);
  }
}

module.exports = authenticateToken;
