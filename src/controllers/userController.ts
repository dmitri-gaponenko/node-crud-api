import { IncomingMessage } from 'http';
import { User } from '../models/user';
import {
  getAllUsers, getUserById, createUser, updateUser, deleteUserById,
} from '../models/userModel';

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

export async function editUser(id: string, req: IncomingMessage): Promise<User | undefined> {
  const currentUser = await getUserById(id);
  if (!currentUser) {
    return undefined;
  }

  const bodyString = await getBody(req);
  const body = JSON.parse(bodyString);

  const updatedUser = {
    username: body.username ?? currentUser.username,
    age: body.age ?? currentUser.age,
    hobbies: body.hobbies ?? currentUser.hobbies,
  };

  const user = await updateUser(id, updatedUser);

  return user;
}

export async function deleteUser(id: string): Promise<boolean> {
  const result = await deleteUserById(id);

  return result;
}
