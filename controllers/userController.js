const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const { createToken } = require('../utils/createToken');

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }
  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    const validPassword = await bcrypt.compare(password, foundUser.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid password' });
    }

    const token = createToken(foundUser._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signUpUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide email and password' });
  }

  const emailConflict = await User.findOne({ email });

  if (emailConflict) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await User.create({ email, password: hashPassword });

    const token = createToken(newUser._id);

    res.status(201).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signUpUser };
