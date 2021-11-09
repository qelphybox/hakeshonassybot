const request = require('supertest');
const app = require('../../server');
const statistics = require('../../../bot/statistics/pg');

describe('Post Endpoints', () => {
  const user = {
    id: 30908482,
    first_name: 'TestFirst',
    last_name: 'TestLast',
    username: 'test',
    auth_date: 1610570912,
    hash: '334871437604f2f1c57a1ec2f5fb0171f99220c3f6c91d6b1188d26e8f9ae2f7',
  };

  const statisticNamesAndTitles = statistics.statsArray.map(({ title, name }) => ({ title, name }));

  const responceAchievments = {
    status: 'ok',
    stupid_achievments: statisticNamesAndTitles,
  };

  describe('/api/stupid_achievments', () => {
    it('response success to signed user', async () => {
      const agent = request.agent(app);

      await agent.get('/auth/callback').query(user).send();
      const response = await agent.get('/api/stupid_achievments').send();

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchObject(responceAchievments);
    });

    it('response forbidden to unsigned user', async () => {
      const response = await request(app)
        .get('/api/stupid_achievments')
        .send();

      const forbidden = { status: 'forbidden' };

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject(forbidden);
    });
  });
});
