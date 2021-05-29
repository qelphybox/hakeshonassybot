const request = require('supertest');
const { extractCookies } = require('../utils/utils');
const app = require('../../server');

describe('Post Endpoints', () => {
  const user = {
    id: 30908482,
    first_name: 'TestFirst',
    last_name: 'TestLast',
    username: 'test',
    auth_date: 1610570912,
    hash: '334871437604f2f1c57a1ec2f5fb0171f99220c3f6c91d6b1188d26e8f9ae2f7',
  };

  const achievments = {
    status: 'ok',
    stupid_achievments: [
      { title: 'Количество сообщений', name: 'messages_count' },
      { title: 'Безработный', name: 'workless_user' },
      { title: 'Поставщик контента', name: 'content_supplier' },
      { title: 'Худший юзер чата', name: 'worst_chat_user' },
      { title: 'Стикерпакер', name: 'stickerpacker' },
      { title: 'Пропавший без вести', name: 'maybe_died' },
      { title: 'Дудь', name: 'dud' },
      { title: 'Философ', name: 'philosopher' },
      { title: 'Юморист', name: 'humorist' },
    ],
  };

  describe('/api/stupid_achievments', () => {
    it('should return stupid_achievments', async () => {
      const authResponse = await request(app)
        .get('/auth/callback')
        .query(user)
        .send();

      const cookies = extractCookies(authResponse.headers);

      const rejectedUser = {
        ...cookies.user,
        id: Number(cookies.user.id),
        auth_date: Number(cookies.user.auth_date),
      };

      const response = await request(app)
        .get('/api/stupid_achievments')
        .set('Cookie', authResponse.headers['set-cookie'])
        .send();

      expect(authResponse.statusCode).toBe(302);
      expect(authResponse.headers.location).toBe('/?auth=success');
      expect(rejectedUser).toMatchObject(user);
      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(achievments);
    });

    it('should return forbidden', async () => {
      const response = await request(app)
        .get('/api/stupid_achievments')
        .send();

      const forbidden = { status: 'forbidden' };

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject(forbidden);
    });
  });
});
