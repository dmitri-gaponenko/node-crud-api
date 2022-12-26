import { IncomingMessage } from 'http';
import { User } from '../models/user.js';
import { getAllUsers, getUserById, createUser } from '../models/userModel.js';

function getBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    try {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        resolve(body);
      });
    } catch (err) {
      reject(err);
    }
  });
}

export async function getUsers(): Promise<User[]> {
  const users = await getAllUsers();

  return users;
}

export async function getUser(id: string): Promise<User | undefined> {
  const user = await getUserById(id);

  return user;
}

export async function addUser(req: IncomingMessage): Promise<User> {
  const bodyString = await getBody(req);
  const body = JSON.parse(bodyString);

  if (!body.username || !body.age || !body.hobbies) {
    throw new Error('Request body does not contain required fields');
  }

  const user = await createUser(body);

  return user;
}
