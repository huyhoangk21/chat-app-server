const express = require('express');
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const validate = require('../../middleware/validateInput');
const router = express.Router();

// post public /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ msg: 'Username or password is not correct' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ msg: 'Username or password is not correct' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
      expiresIn: '1d',
    });

    res.status(200).json({ token, user: username });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// post public /api/auth/signup
router.post('/signup', validate, async (req, res) => {
  try {
    const { username, password } = req.body;

    let user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ msg: 'User already existed' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, password: hashedPassword });

    await user.save();

    res.status(200).json({ msg: 'Registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

module.exports = router;
