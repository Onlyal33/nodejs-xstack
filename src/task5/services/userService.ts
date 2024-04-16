import { v4 as uuidv4 } from 'uuid';
import type { User, UserFromClient } from '../models/User.js';

let users: User[] = [];

const findUserById = (userId: string): User | undefined => {
  return users.find((user) => user.id === userId);
};

export const createUser = (user: UserFromClient): User => {
  const newUser = { id: uuidv4(), ...user, hobbies: [] };
  users.push(newUser);
  return newUser;
};

export const getUsersList = (): User[] => {
  return users;
};

export const deleteUserById = (userId: string): boolean => {
  const userExists = users.some((user) => user.id === userId);
  if (userExists) {
    users = users.filter((user) => user.id !== userId);
    return true;
  }

  return false;
};

export const updateUserHobbiesById = (
  userId: string,
  newHobbies: string[]
): User | null => {
  const user = findUserById(userId);
  if (user) {
    user.hobbies = Array.from(new Set([...user.hobbies, ...newHobbies]));
    return user;
  }

  return null;
};

export const getUserHobbiesById = (userId: string): string[] | null => {
  const user = findUserById(userId);
  return user ? user.hobbies : null;
};
