import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';
import {validationResult} from 'express-validator';
import CustomError from './classes/CustomError';
import {ErrorResponse} from 'hybrid-types/MessageTypes';
import {TokenContent} from 'hybrid-types/DBTypes';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`🔍 - Not Found - ${req.originalUrl}`, 404);
  next(error);
};

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<ErrorResponse>,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  // console.log(err);
  const statusCode = err.status !== 200 ? err.status || 500 : 500;
  res.status(statusCode).json({
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

    if (!userFromToken) {
      next(new CustomError('Token not valid', 403));
      return;
    }

    res.locals.user = userFromToken;
    // token added for deleting media
    res.locals.token = token;

    next();
  } catch (error) {
    next(new CustomError((error as Error).message, 400));
  }
};

const validationErrors = (req: Request, _res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages: string = errors
      .array({onlyFirstError: true})
      .map(
        (error) => `${error.msg}: ${(error as unknown as {path: string}).path}`, // type gymnastics because of express-validator type is not correct
      )
      .join(', ');
    next(new CustomError(messages, 400));
    return;
  }
  next();
};

export {notFound, errorHandler, authenticate, validationErrors};
