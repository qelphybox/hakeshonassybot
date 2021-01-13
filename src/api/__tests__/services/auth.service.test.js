const AuthService = require('../../services/auth.service');

describe('AuthService', () => {
  const dataObject = {
    id: 30908482,
    first_name: 'TestFirst',
    last_name: 'TestLast',
    username: 'test',
    auth_date: 1610570912,
    hash: '0d0e9c0742d6369e072db584749f01e134a9f20b8f04948965f0a8d50ed140ae',
  };

  it('checkHmacToken should return false if data incorrect', () => {
    const result = AuthService.checkHmacToken(dataObject);
    expect(result).toBe(true);
  });

  it('checkHmacToken should return true if data correct', () => {
    const incorrectDataObject = { ...dataObject, id: 123 };
    const result = AuthService.checkHmacToken(incorrectDataObject);
    expect(result).toBe(false);
  });
});
