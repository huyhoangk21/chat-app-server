module.exports = (req, res, next) => {
  const { username, password, password2 } = req.body;

  if (username.length < 6) {
    return res
      .status(400)
      .json({ msg: 'Username must be at least 6 characters.' });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: 'Password must be at least 6 characters.' });
  }

  if (password2 && password !== password2) {
    return res.status(400).json({ msg: 'Passwords do not match' });
  }

  next();
};
