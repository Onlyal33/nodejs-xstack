export interface UserFromClient {
  name: string;
  email: string;
}

export interface User extends UserFromClient {
  id: string;
  hobbies: string[];
}
