const {stats} = require('../src/stats');

const {getUserStatString, renderMessage} = require('../src/render');

describe('getUserStatString', () => {
  test('username: test, count: 2', () => {
    expect(getUserStatString({username: 'test', count: 2})).toBe('@test (2)');
  });
});


describe('renderMessage', () => {
  test('TODAY_MESSAGE_COUNT', () => {
    const statsArray = [{
      name: stats.TODAY_MESSAGE_COUNT,
      data: [{username: 'test', count: 1}, {username: 'test2', count: 2}]
    }]
    expect(renderMessage(statsArray)).toBe(`Сообщений за последние 24 часа: @test (1), @test2 (2)`);
  });

  test('HOUR_MESSAGE_COUNT', () => {
    const statsArray = [
      {
        name: stats.TODAY_MESSAGE_COUNT,
        data: [{username: 'test', count: 1}, {username: 'test2', count: 2}]
      },
      {
        name: stats.HOUR_MESSAGE_COUNT,
        data: [{username: 'test', count: 1}, {username: 'test2', count: 2}]
      }
    ]
    expect(renderMessage(statsArray)).toBe(
      'Сообщений за последние 24 часа: @test (1), @test2 (2)\n' +
      'Сообщений за последний час: @test (1), @test2 (2)'
    );
  });

  test('HOUR_MESSAGE_COUNT and TODAY_MESSAGE_COUNT', () => {
    const statsArray = [{
      name: stats.HOUR_MESSAGE_COUNT,
      data: [{username: 'test', count: 1}, {username: 'test2', count: 2}]
    }]
    expect(renderMessage(statsArray)).toBe('Сообщений за последний час: @test (1), @test2 (2)');
  });

  test('empty array', () => {
    const statsArray = []
    expect(renderMessage(statsArray)).toBe('');
  });
});

