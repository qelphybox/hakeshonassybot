const { getUserLink, getUserStatString } = require('../src/utils/render');

describe('getUserStatString', () => {
  test('username: test, count: 2', () => {
    expect(getUserStatString({
      _id: 1,
      username: 'test',
      first_name: 'test',
      last_name: 'test',
      count: 2,
    })).toBe('test test (2)');
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
