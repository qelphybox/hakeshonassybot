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

  describe('/auth/callback', () => {
    it('should redirect with success', async () => {
      const response = await request(app)
        .get('/auth/callback')
        .query(user)
        .send();

      const cookies = extractCookies(response.headers);

      const rejectedUser = {
        ...cookies.user,
        id: Number(cookies.user.id),
        auth_date: Number(cookies.user.auth_date),
      };
      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/?auth=success');
      expect(rejectedUser).toMatchObject(user);
    });

    it('should redirect with fail', async () => {
      const badUser = { ...user, username: 'bad' };
      const response = await request(app)
        .get('/auth/callback')
        .query(badUser)
        .send();

      const cookies = response.headers['set-cookie'];

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/?auth=fail');
      expect(cookies).toBe(undefined);
    });
  });

  describe('/auth/logout', () => {
    it('should clear cookie and send "Bye!" message', async () => {
      const response = await request(app)
        .get('/auth/logout')
        .set('Cookie', `user=${JSON.stringify(user)}`)
        .send();

      const cookies = extractCookies(response.headers);

      expect(response.statusCode).toBe(200);
      expect(response.body).toStrictEqual({ message: 'Bye!' });
      expect(cookies.user).toBe('');
    });
  });
});
