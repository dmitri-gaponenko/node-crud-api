import 'dotenv/config';
import { createServer, IncomingMessage, ServerResponse } from 'http';

const message = 'Hello crud api!';
const users = [
  {
    id: '1',
    username: 'testUser',
    age: '33',
    hobbies: ['dance', 'chess'],
  },
];

console.log(message);

const PORT = process.env.PORT || 4000;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  console.log(`req.url: ${req.url}, ${req.method}\n`);

  const urlArgs = req.url?.split('/').filter(Boolean) || [];
  let result;
  let statusCode = 200;

  if (`${urlArgs[0]}/${urlArgs[1]}` === 'api/users' && (urlArgs.length === 2 || urlArgs.length === 3)) {
    switch (req.method) {
      case 'GET':
        if (urlArgs.length === 2) {
          console.log('> find all users');
        } else {
          const userId = urlArgs[2];
          console.log(`> find user by id ${userId}`);
        }
        result = users;
        break;

      case 'POST':
        if (urlArgs.length === 2) {
          console.log('> create user');
          result = users;
        } else {
          result = { code: 404, errorMessage: 'Page Not Found' };
          statusCode = 404;
        }
        break;

      case 'PUT':
        if (urlArgs.length === 3) {
          const userId = urlArgs[2];
          console.log(`> update user id ${userId}`);
          result = users;
        } else {
          result = { code: 404, errorMessage: 'Page Not Found' };
          statusCode = 404;
        }
        break;

      case 'DELETE':
        if (urlArgs.length === 3) {
          const userId = urlArgs[2];
          console.log(`> delete user id ${userId}`);
          result = users;
        } else {
          result = { code: 404, errorMessage: 'Page Not Found' };
          statusCode = 404;
        }
        break;

      default:
        result = { code: 404, errorMessage: 'Page Not Found' };
        statusCode = 404;
        break;
    }
  } else {
    result = { code: 404, errorMessage: 'Page Not Found' };
    statusCode = 404;
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(result));
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}/`);
});
