const AuthService = require('../../services/auth.service');

describe('AuthService', () => {
  const dataObject = {
    id: 30908482,
    first_name: 'TestFirst',
    last_name: 'TestLast',
    username: 'test',
    auth_date: 1610570912,
  };

  const hash = '334871437604f2f1c57a1ec2f5fb0171f99220c3f6c91d6b1188d26e8f9ae2f7';

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

  it('checkHmacToken should return true if data correct', () => {
    const result = AuthService.checkHmacToken(telegramBotToken, hash, dataObject);
    expect(result).toBe(true);
  });

  it('checkHmacToken should return false if data incorrect', () => {
    const incorrectDataObject = { ...dataObject, id: 123 };
    const result = AuthService.checkHmacToken(telegramBotToken, hash, incorrectDataObject);
    expect(result).toBe(false);
  });
});
