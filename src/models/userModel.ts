import { v4 as uuidv4 } from 'uuid';
import { User, storage } from './user.js';

const { users } = storage;

export function getAllUsers() {
  return new Promise<User[]>((resolve) => {
    resolve(users);
  });
}

export function getUserById(id: string) {
  return new Promise<User | undefined>((resolve) => {
    const user = users.find((obj) => obj.id === id);
    resolve(user);
  });
}

export function createUser(user: User) {
  return new Promise<User>((resolve) => {
    const newUser = { id: uuidv4(), ...user } as User;
    users.push(newUser);
    resolve(newUser);
  });
}

export function updateUser(id: string, user: User) {
  return new Promise<User>((resolve) => {
    const index = users.findIndex((obj) => obj.id === id);
    users[index] = { id, ...user };
    resolve(users[index]);
  });
}

export function deleteUserById(id: string) {
  return new Promise<boolean>((resolve) => {
    const index = users.findIndex((obj) => obj.id === id);
    if (index > -1) {
      users.splice(index, 1);
      resolve(true);
    } else {
      resolve(false);
    }
  });
}
