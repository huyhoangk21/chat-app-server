const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = async (req, res, next) => {
  const token = req.header('token');
  if (!token) return res.status(401).json({ msg: 'Unauthorized' });
  try {
    const verified = await jwt.verify(token, process.env.SECRET);
    req.user = verified;
  } catch (error) {
    res.status(401).json({ msg: error.message });
  }

  next();
};
