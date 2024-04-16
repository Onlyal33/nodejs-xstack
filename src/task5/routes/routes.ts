import type { Routes } from 'task5/models/Routes.js';
import {
  createUser,
  deleteUser,
  getUserHobbies,
  getUsers,
  updateUserHobbies,
} from '../controllers/userController.js';

export const routes: Routes = {
  GET: {
    '/api/users/:userId/hobbies': {
      handler: getUserHobbies,
      cache: { ttl: 3600, private: true },
    },
    '/api/users': { handler: getUsers, cache: { ttl: 3600, private: false } },
  },
  POST: {
    '/api/users': { handler: createUser },
  },
  DELETE: {
    '/api/users/:userId': { handler: deleteUser },
  },
  PATCH: {
    '/api/users/:userId/hobbies': { handler: updateUserHobbies },
  },
};
