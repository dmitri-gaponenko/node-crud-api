import supertest from 'supertest';
import server from '../src/index';

describe('api test scenario 1', () => {
  test('404 api request', async () => {
    const res = await supertest(server).get('/');
    expect(res.statusCode).toEqual(404);
    expect(res.body.errorMessage).toEqual('Page Not Found');
    server.close();
  });

  test('add new record without required fields', async () => {
    const res = await supertest(server)
      .post('/api/users')
      .send({
        username: 'testUser'
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errorMessage).toEqual('Request body does not contain required fields');

    server.close();
  });

  test('get record by invalid userId', async () => {
    const res = await supertest(server).get(`/api/users/123`)

    expect(res.statusCode).toEqual(400);
    expect(res.body.errorMessage).toEqual('UserId is invalid');

    server.close();
  });
});

describe('api test scenario 2', () => {
  let testUserId: string;
  const testUser = {
    username: 'testUser',
    age: 20,
    hobbies: ['dance', 'chess']
  };
  const testUserUpdated = {
    username: 'testUserUpdated',
    age: 22,
    hobbies: ['football', 'golf']
  };

  test('get all records (empty)', async () => {
    const res = await supertest(server).get('/api/users');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([]);

    server.close();
  });

  test('add new record', async () => {
    const res = await supertest(server)
      .post('/api/users')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toEqual(testUser.username);
    expect(res.body.age).toEqual(testUser.age);
    expect(res.body.hobbies).toEqual(testUser.hobbies);

    testUserId = res.body.id;

    server.close();
  });

  test('get created record', async () => {
    const res = await supertest(server).get(`/api/users/${testUserId}`)

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual(testUser.username);
    expect(res.body.age).toEqual(testUser.age);
    expect(res.body.hobbies).toEqual(testUser.hobbies);

    server.close();
  });

  test('update record', async () => {
    const res = await supertest(server)
      .put(`/api/users/${testUserId}`)
      .send(testUserUpdated);

    expect(res.statusCode).toEqual(200);
    expect(res.body.username).toEqual(testUserUpdated.username);
    expect(res.body.age).toEqual(testUserUpdated.age);
    expect(res.body.hobbies).toEqual(testUserUpdated.hobbies);

    testUserId = res.body.id;

    server.close();
  });

  test('delete record', async () => {
    const res = await supertest(server).delete(`/api/users/${testUserId}`)

    expect(res.statusCode).toEqual(204);

    server.close();
  });

  test('get deleted record', async () => {
    const res = await supertest(server).get(`/api/users/${testUserId}`)

    expect(res.statusCode).toEqual(404);
    expect(res.body.errorMessage).toEqual('User Not Found');

    server.close();
  });
});

describe('api test scenario 3', () => {
  test('add new record with userId in url', async () => {
    const res = await supertest(server)
      .post('/api/users/f1b03b32-da56-42f1-872e-1d60c1db2a85')
      .send({
        username: 'testUser',
        age: 20,
        hobbies: ['dance', 'chess']
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body.errorMessage).toEqual('Page Not Found');

    server.close();
  });

  test('add new record with incorrect types of fields', async () => {
    const res = await supertest(server)
      .post('/api/users')
      .send({
        username: 1,
        age: '22',
        hobbies: 'dance'
      });

    expect(res.statusCode).toEqual(400);

    server.close();
  });

  test('update non-existed record', async () => {
    const res = await supertest(server)
      .put(`/api/users/f1b03b32-da56-42f1-872e-1d60c1db2a85`)
      .send({
        username: 'testUser',
        age: 20,
        hobbies: ['dance', 'chess']
      });

    expect(res.statusCode).toEqual(404);
    expect(res.body.errorMessage).toEqual('User Not Found');

    server.close();
  });
});