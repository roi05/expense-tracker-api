const jwt = require('jsonwebtoken');
require('dotenv').config();

const createToken = userId => {
  const payload = {
    userId,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY);

  return token;
};

module.exports = { createToken };
