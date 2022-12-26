export type User = {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
};

interface Storage {
  users: User[];
}

export const storage: Storage = {
  users: [
    {
      id: 'f884c946-9238-4fab-883f-2cf68ef224d9',
      username: 'testUser',
      age: 18,
      hobbies: ['dance', 'chess'],
    },
  ],
};
