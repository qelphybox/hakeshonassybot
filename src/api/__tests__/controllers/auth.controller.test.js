const AuthController = require('../../controllers/auth.controller');
const AuthService = require('../../services/auth.service');

jest.mock('../../services/auth.service');

describe('AuthController', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    mockRequest = {
      query: {
        id: 1,
        first_name: 'Sergey',
        username: 'test:',
        auth_date: 1610570912,
      },
    };
    mockResponse = {
      cookie: jest.fn(),
      redirect: jest.fn(),
      clearCookie: jest.fn(),
      send: jest.fn(),
      status: jest.fn(),
    };
  });

  it('callback when token is correct', () => {
    jest.spyOn(AuthService, 'checkHmacToken')
      .mockReturnValue(true);

    AuthController.callback(mockRequest, mockResponse);
    expect(AuthService.checkHmacToken).toBeCalledWith(mockRequest.query);
    expect(mockResponse.cookie).toBeCalledWith('user', mockRequest.query, { httpOnly: true });
    expect(mockResponse.redirect).toBeCalledWith('/?auth=success');
  });

  it('callback when token is not correct', () => {
    jest.spyOn(AuthService, 'checkHmacToken')
      .mockReturnValue(false);

    AuthController.callback(mockRequest, mockResponse);
    expect(AuthService.checkHmacToken).toBeCalledWith(mockRequest.query);
    expect(mockResponse.cookie).not.toBeCalled();
    expect(mockResponse.redirect).toBeCalledWith('/?auth=fail');
  });

  it('logout should redirect', () => {
    AuthController.logout(mockRequest, mockResponse);
    expect(AuthService.checkHmacToken).toBeCalledWith(mockRequest.query);
    expect(mockResponse.clearCookie).toBeCalledWith('user');
    expect(mockResponse.send).toBeCalledWith({ message: 'Bye!' });
    expect(mockResponse.status).toBeCalledWith(200);
  });
});

/*
auth_date: 1610484415
first_name: "Sergey"
hash: "bc2bb8bd7d81cd5c4e1498d4124135cc74408c0de8d316f21772ead661ec6061"
id: 309091867
last_name: "Vyborov"
username: "svyborov"
 */
