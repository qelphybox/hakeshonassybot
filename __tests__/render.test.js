
const { getUserLink, getUserStatString, renderMessage } = require('../src/utils/render');

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


describe('getUserLink', () => {
  test('first_name and last_name', () => {
    expect(getUserLink({
      _id: 1,
      username: 'test',
      first_name: 'test',
      last_name: 'test',
    })).toBe('[test test](tg://user?id=1)');
  });

  test('only first name', () => {
    expect(getUserLink({
      _id: 1,
      username: 'test',
      first_name: 'test',
    })).toBe('[test](tg://user?id=1)');
  });
});

describe('renderMessage', () => {
  test('render stats', () => {
    const statsStringsArray = [
      'Сообщений за последние 24 часа: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)',
      'Сообщений за последний час: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)',
    ];
    expect(renderMessage(statsStringsArray)).toBe('Сообщений за последние 24 часа: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)\n'
      + 'Сообщений за последний час: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)');
  });

  test('filter empty stats', () => {
    const statsStringsArray = [
      '',
      'Сообщений за последние 24 часа: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)',
      '',
      'Сообщений за последний час: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)',
      '',
    ];
    expect(renderMessage(statsStringsArray)).toBe('Сообщений за последние 24 часа: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)\n'
      + 'Сообщений за последний час: [test test](tg://user?id=1) (1), [test test](tg://user?id=2) (2)');
  });

  test('empty array', () => {
    const statsArray = [];
    expect(renderMessage(statsArray)).toBe('');
  });
});
