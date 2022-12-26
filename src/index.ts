import 'dotenv/config';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { validate, version } from 'uuid';
import {
  getUsers, getUser, addUser, editUser, deleteUser,
} from './controllers/userController.js';

const message = 'Hello crud api!';

console.log(message);

const PORT = process.env.PORT || 4000;

const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  console.log(`req.url: ${req.url}, ${req.method}\n`);

  const urlArgs = req.url?.split('/').filter(Boolean) || [];
  let result;
  let statusCode = 200;

  if (`${urlArgs[0]}/${urlArgs[1]}` === 'api/users' && (urlArgs.length === 2 || urlArgs.length === 3)) {
    switch (req.method) {
      case 'GET':
        if (urlArgs.length === 2) {
          console.log('> find all users');
          result = await getUsers();
        } else {
          const userId = urlArgs[2];
          console.log(`> find user by id ${userId}`);
          if (validate(userId) && version(userId) === 4) {
            const user = await getUser(userId);
            if (user) {
              result = user;
            } else {
              result = { code: 404, errorMessage: 'User Not Found' };
              statusCode = 404;
            }
          } else {
            result = { code: 400, errorMessage: 'UserId is invalid' };
            statusCode = 400;
          }
        }
        break;

      case 'POST':
        if (urlArgs.length === 2) {
          console.log('> create user');
          try {
            result = await addUser(req);
            statusCode = 201;
          } catch (error) {
            result = { code: 400, errorMessage: 'Request body does not contain required fields' };
            statusCode = 400;
          }
        } else {
          result = { code: 404, errorMessage: 'Page Not Found' };
          statusCode = 404;
        }
        break;

      case 'PUT':
        if (urlArgs.length === 3) {
          const userId = urlArgs[2];
          console.log(`> update user id ${userId}`);
          if (validate(userId) && version(userId) === 4) {
            try {
              result = await editUser(userId, req);
              if (result) {
                statusCode = 200;
              } else {
                result = { code: 404, errorMessage: 'User Not Found' };
                statusCode = 404;
              }
            } catch (error) {
              result = { code: 400, errorMessage: 'Request body does not contain required fields' };
              statusCode = 400;
            }
          } else {
            result = { code: 400, errorMessage: 'UserId is invalid' };
            statusCode = 400;
          }
        } else {
          result = { code: 404, errorMessage: 'Page Not Found' };
          statusCode = 404;
        }
        break;

      case 'DELETE':
        if (urlArgs.length === 3) {
          const userId = urlArgs[2];
          console.log(`> delete user id ${userId}`);
          if (validate(userId) && version(userId) === 4) {
            const userDeleted = await deleteUser(userId);
            if (userDeleted) {
              statusCode = 204;
            } else {
              result = { code: 404, errorMessage: 'User Not Found' };
              statusCode = 404;
            }
          } else {
            result = { code: 400, errorMessage: 'UserId is invalid' };
            statusCode = 400;
          }
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
