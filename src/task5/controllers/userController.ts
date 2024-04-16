import { IncomingMessage, ServerResponse } from 'node:http';

import type { UserFromClient } from '../models/User.js';
import * as userService from '../services/userService.js';
import { parseRequestBody } from '../utils.js';

export const createUser = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  const reqBody = await parseRequestBody<UserFromClient>(req);
  const { name, email } = reqBody;
  const user = userService.createUser({ name, email });
  res.statusCode = 201;
  return {
    data: {
      user,
      links: {
        self: `/api/users/${user.id}`,
        hobbies: `/api/users/${user.id}/hobbies`,
      },
    },
    error: null,
  };
};

export const getUsers = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>
) => {
  const users = userService.getUsersList();
  res.statusCode = 200;
  return {
    data: users.map((user) => ({
      user,
      links: {
        self: `/api/users/${user.id}`,
        hobbies: `/api/users/${user.id}/hobbies`,
      },
    })),
    error: null,
  };
};

export const deleteUser = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  matches?: RegExpMatchArray
) => {
  const userId = matches?.[1];
  if (!userId) {
    res.statusCode = 404;
    return { data: null, error: 'User id not found' };
  }

  const success = userService.deleteUserById(userId);
  if (!success) {
    res.statusCode = 404;
    return {
      data: null,
      error: `User with id ${userId} doesn't exist`,
    };
  }

  res.statusCode = 200;
  return { data: { success: true }, error: null };
};

export const updateUserHobbies = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  matches?: RegExpMatchArray
) => {
  const userId = matches?.[1];
  if (!userId) {
    res.statusCode = 404;
    return { data: null, error: 'User id not found' };
  }

  const { hobbies } = await parseRequestBody<{ hobbies: string[] }>(req);
  const updatedUser = userService.updateUserHobbiesById(userId, hobbies);
  if (!updatedUser) {
    res.statusCode = 404;
    return { data: null, error: `User with id ${userId} doesn't exist` };
  }

  res.statusCode = 200;
  return {
    data: {
      user: updatedUser,
      links: {
        self: `/api/users/${userId}`,
        hobbies: `/api/users/${userId}/hobbies`,
      },
    },
    error: null,
  };
};

export const getUserHobbies = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage>,
  matches?: RegExpMatchArray
) => {
  const userId = matches?.[1];
  if (!userId) {
    res.statusCode = 404;
    return { data: null, error: 'User id not found' };
  }

  const hobbies = userService.getUserHobbiesById(userId);
  if (!hobbies) {
    res.statusCode = 404;
    return {
      data: null,
      error: `User with id ${userId} doesn't exist`,
    };
  }

  res.statusCode = 200;
  return {
    data: {
      hobbies,
      links: {
        self: `/api/users/${userId}/hobbies`,
        user: `/api/users/${userId}`,
      },
    },
    error: null,
  };
};
