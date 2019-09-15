const request = require('supertest');
const server = require('../../io-server');
const {
  setupAll,
  teardownEach,
  teardownAll,
  addTestUser,
  addTestUserWithBoards,
} = require('../utils');

beforeAll(async done => {
  await setupAll();
  done();
});

afterAll(async done => {
  await teardownAll();
  done();
});

beforeEach(async done => {
  await teardownEach();
  done();
});

afterEach(() => {
  server.close();
});

describe('GET /api/me', () => {
  const meRequest = async () => {
    const {token} = await addTestUser();
    const response = await request(server)
      .get('/api/me')
      .set('Authorization', `Bearer ${token}`);
    return response;
  };

  it('200: responds with a user object', async () => {
    const expected = {
      user: {
        id: expect.any(Number),
        email: 'test@gmail.com',
        username: 'Tester',
      },
    };

    const {status, body} = await meRequest();
    expect(status).toBe(200);
    expect(body).toEqual(expected);
  });

  it('401: responds with an errors array if no auth token is provided', async () => {
    const expected = {
      errors: [{message: 'Access denied. Invalid token', status: 401}],
    };

    const {status, body} = await request(server).get('/api/me');
    expect(status).toBe(401);
    expect(body).toEqual(expected);
  });
});

describe('GET /api/me/boards', () => {
  const getBoardsRequest = async token => {
    const response = await request(server)
      .get('/api/me/boards')
      .set('Authorization', `Bearer ${token}`);
    return response;
  };

  it('200: responds with a list of board objects', async () => {
    const {token, user} = await addTestUserWithBoards();
    const expected = {
      boards: [
        {
          title: 'test_board_1',
          id: expect.any(Number),
          owner_id: user.id,
          owner_type: 'user',
        },
        {
          title: 'test_board_2',
          id: expect.any(Number),
          owner_id: user.id,
          owner_type: 'user',
        },
      ],
    };

    const {status, body} = await getBoardsRequest(token);
    expect(status).toBe(200);
    expect(body).toEqual(expected);
  });

  it('401: responds with an errors array if no auth token is provided', async () => {
    const expected = {
      errors: [{message: 'Access denied. Invalid token', status: 401}],
    };

    const {status, body} = await request(server).get('/api/me/boards');
    expect(status).toBe(401);
    expect(body).toEqual(expected);
  });
});

describe('POST /api/me/boards', () => {
  const createBoardRequest = async board => {
    const {token} = await addTestUser();
    const response = await request(server)
      .post('/api/me/boards')
      .send(board)
      .set('Authorization', `Bearer ${token}`);
    return response;
  };

  it('201: responds with a board object', async () => {
    const testBoard = {
      title: 'Slothy',
    };
    const expected = {
      board: {
        id: expect.any(Number),
        title: 'Slothy',
        owner_type: 'user',
        owner_id: expect.any(Number),
      },
    };
    const {status, body} = await createBoardRequest(testBoard);
    expect(status).toBe(201);
    expect(body).toEqual(expected);
  });

  it('400: responds with an errors array if title is missing', async () => {
    const testBoard = {};
    const expected = {
      errors: [
        {
          status: 400,
          message: 'title field is missing',
        },
      ],
    };
    const {status, body} = await createBoardRequest(testBoard);
    expect(status).toBe(400);
    expect(body).toEqual(expected);
  });

  it('400: responds with an errors array if title is not a string', async () => {
    const testBoard = {
      title: 2,
    };
    const expected = {
      errors: [
        {
          status: 400,
          message: 'title field must be a string',
        },
      ],
    };
    const {status, body} = await createBoardRequest(testBoard);
    expect(status).toBe(400);
    expect(body).toEqual(expected);
  });

  it('400: responds with an errors array if title is longer than 32 characters', async () => {
    const testBoard = {
      title:
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    };
    const expected = {
      errors: [
        {
          status: 400,
          message: 'title field should not be longer than 32 characters',
        },
      ],
    };
    const {status, body} = await createBoardRequest(testBoard);
    expect(status).toBe(400);
    expect(body).toEqual(expected);
  });
});
