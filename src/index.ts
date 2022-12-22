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
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(users));
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}/`);
});
