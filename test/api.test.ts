import supertest from 'supertest';
import server from '../src/index';

describe('api test 1', () => {
  test('404 api request', async () => {
    const res = await supertest(server).get('/');
    expect(res.statusCode).toEqual(404);
    server.close();
  });
});
