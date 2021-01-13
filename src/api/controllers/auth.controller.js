const AuthService = require('../services/auth.service');

const callback = (req, res) => {
  const user = { ...req.query };
  const isTokenCorrect = AuthService.checkHmacToken(user);
  if (isTokenCorrect) {
    res.cookie('user', user, { httpOnly: true });
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
