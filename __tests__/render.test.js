const { stats } = require('../src/stats');

const { getUserStatString, renderMessage } = require('../src/render');

describe('getUserStatString', () => {
  test('username: test, count: 2', () => {
    expect(getUserStatString({
      _id: 1,
      username: 'test',
      first_name: 'test',
      last_name: 'test',
      count: 2,
    })).toBe('[test test](tg://user?id=1) (2)');
  });
});


describe('renderMessage', () => {
  test('TODAY_MESSAGE_COUNT', () => {
    const statsArray = [{
      name: stats.TODAY_MESSAGE_COUNT,
      data: [{
        _id: 1,
        username: 'test',
        first_name: 'test',
        last_name: 'test',
        count: 1,
      },
      {
        _id: 2,
        username: 'test2',
        first_name: 'test2',
        last_name: 'test2',
        count: 2,
      }],
    }];
    expect(renderMessage(statsArray)).toBe('Сообщений за последние 24 часа: [test test](tg://user?id=1) (1), [test2 test2](tg://user?id=2) (2)');
  });

  test('HOUR_MESSAGE_COUNT', () => {
    const statsArray = [
      {
        name: stats.TODAY_MESSAGE_COUNT,
        data: [{
          _id: 1,
          username: 'test',
          first_name: 'test',
          last_name: 'test',
          count: 1,
        },
        {
          _id: 2,
          username: 'test2',
          first_name: 'test',
          last_name: 'test',
          count: 2,
        }],
      },
      {
        name: stats.HOUR_MESSAGE_COUNT,
        data: [{
          _id: 1,
          username: 'test',
          first_name: 'test',
          last_name: 'test',
          count: 1,
        },
        {
          _id: 2,
          username: 'test2',
          first_name: 'test',
          last_name: 'test',
          count: 2,
        }],
      },
    ];
    expect(renderMessage(statsArray)).toBe(
      'Сообщений за последние 24 часа: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)\n'
      + 'Сообщений за последний час: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)',
    );
  });

  test('HOUR_MESSAGE_COUNT and TODAY_MESSAGE_COUNT', () => {
    const statsArray = [{
      name: stats.HOUR_MESSAGE_COUNT,
      data: [{
        _id: 1,
        username: 'test',
        first_name: 'test',
        last_name: 'test',
        count: 1,
      },
      {
        _id: 2,
        username: 'test2',
        first_name: 'test',
        last_name: 'test',
        count: 2,
      }],
    }];
    expect(renderMessage(statsArray)).toBe('Сообщений за последний час: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)');
  });

  test('empty array', () => {
    const statsArray = [];
    expect(renderMessage(statsArray)).toBe('');
  });
});
