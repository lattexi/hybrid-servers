// Description: This file contains the functions for the user routes

import {NextFunction, Request, Response} from 'express';
import CustomError from '../../classes/CustomError';
import bcrypt from 'bcryptjs';
import {UserDeleteResponse, UserResponse} from 'hybrid-types/MessageTypes';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  modifyUser,
} from '../models/userModel';
import {TokenContent, User, UserWithNoPassword} from 'hybrid-types/DBTypes';

const salt = bcrypt.genSaltSync(12);

const userListGet = async (
  req: Request,
  res: Response<UserWithNoPassword[]>,
  next: NextFunction,
) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

const userGet = async (
  req: Request<{id: string}>,
  res: Response<UserWithNoPassword>,
  next: NextFunction,
) => {
  try {
    const user = await getUserById(Number(req.params.id));
    res.json(user);
  } catch (error) {
    next(error);
  }
};

const userPost = async (
  req: Request<{}, {}, User>,
  res: Response<UserResponse>,
  next: NextFunction,
) => {
  try {
    const user = req.body;
    user.password = await bcrypt.hash(user.password, salt);

    console.log(user);

    const newUser = await createUser(user);
    console.log('newUser', newUser);
    if (!newUser) {
      next(new CustomError('User not created', 500));
      return;
    }
    const response: UserResponse = {
      message: 'user created',
      user: newUser,
    };
    res.json(response);
  } catch (error) {
    next(new CustomError('Duplicate entry', 400));
  }
};

const userPut = async (
  req: Request<{}, {}, User>,
  res: Response<UserResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const userFromToken = res.locals.user;

    const user = req.body;
    if (user.password) {
      user.password = await bcrypt.hash(user.password, salt);
    }

    console.log('userPut', userFromToken, user);

    const result = await modifyUser(user, userFromToken.user_id);

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    console.log('put result', result);

    const response: UserResponse = {
      message: 'user updated',
      user: result,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const userDelete = async (
  req: Request,
  res: Response<UserDeleteResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const userFromToken = res.locals.user;
    console.log('user from token', userFromToken);

    const result = await deleteUser(userFromToken.user_id);

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }
    console.log(result);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const userPutAsAdmin = async (
  req: Request<{id: string}, {}, User>,
  res: Response<UserResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    if (res.locals.user.level_name !== 'Admin') {
      next(new CustomError('You are not authorized to do this', 401));
      return;
    }
    const user = req.body;
    if (user.password) {
      user.password = await bcrypt.hash(user.password, salt);
    }

    const result = await modifyUser(user, Number(req.params.id));

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    const response: UserResponse = {
      message: 'user updated',
      user: result,
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

const userDeleteAsAdmin = async (
  req: Request<{id: string}>,
  res: Response<UserDeleteResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    if (res.locals.user.level_name !== 'Admin') {
      next(new CustomError('You are not authorized to do this', 401));
      return;
    }

    const result = await deleteUser(Number(req.params.id));

    if (!result) {
      next(new CustomError('User not found', 404));
      return;
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

const checkToken = async (
  req: Request,
  res: Response<UserResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  const userFromToken = res.locals.user;
  // check if user exists in database
  const user = await getUserById(userFromToken.user_id);
  if (!user) {
    next(new CustomError('User not found', 404));
    return;
  }

  const message: UserResponse = {
    message: 'Token is valid',
    user: user,
  };
  res.json(message);
};

const checkEmailExists = async (
  req: Request<{email: string}>,
  res: Response<{available: boolean}>,
  next: NextFunction,
) => {
  try {
    console.log('test email check', req.params.email);
    const user = await getUserByEmail(req.params.email);
    res.json({available: user ? false : true});
  } catch (error) {
    next(error);
  }
};

const checkUsernameExists = async (
  req: Request<{username: string}>,
  res: Response<{available: boolean}>,
  next: NextFunction,
) => {
  try {
    const user = await getUserByUsername(req.params.username);
    res.json({available: user ? false : true});
  } catch (error) {
    next(error);
  }
};

export {
  userListGet,
  userGet,
  userPost,
  userPut,
  userDelete,
  userPutAsAdmin,
  userDeleteAsAdmin,
  checkToken,
  checkEmailExists,
  checkUsernameExists,
};
