const AuthService = require('../services/auth.service');

const callback = (req, res) => {
  const user = { ...req.query };
  const isTokenCorrect = AuthService.validateTelegramAuth(user);
  if (isTokenCorrect) {
    const userString = JSON.stringify(user);
    res.cookie('user', userString, { httpOnly: true });
    res.redirect('/?auth=success');
    return;
  }
  res.redirect('/?auth=fail');
};

const logout = (req, res) => {
  res.clearCookie('user');
  res.send({ message: 'Bye!' });
  res.status(200);
};

module.exports = { callback, logout };
