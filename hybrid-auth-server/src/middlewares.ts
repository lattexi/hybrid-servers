/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import {ErrorResponse} from 'hybrid-types/MessageTypes';
import CustomError from './classes/CustomError';
import jwt from 'jsonwebtoken';
import {getUserById} from './api/models/userModel';
import {TokenContent} from 'hybrid-types/DBTypes';
import {validationResult} from 'express-validator';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction,
) => {
  console.error('errorHandler', err);
  res.status(err.status || 500);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const bearer = req.headers.authorization;
    if (!bearer) {
      next(new CustomError('No token provided', 401));
      return;
    }

    const token = bearer.split(' ')[1];

    if (!token) {
      next(new CustomError('No token provided', 401));
      return;
    }

    const userFromToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenContent;

    console.log('userFromToken', userFromToken);

    const user = await getUserById(userFromToken.user_id);

    if (!user) {
      next(new CustomError('Token not valid', 403));
      return;
    }

    res.locals.user = user;

    next();
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

const validationErrors = (req: Request, _res: Response, next: NextFunction) => {
  console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array()
      .map((error) => `${error.msg}: ${error.type}`)
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }
  next();
};

export {notFound, errorHandler, authenticate, validationErrors};
