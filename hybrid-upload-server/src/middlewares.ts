/* eslint-disable @typescript-eslint/no-unused-vars */
import {NextFunction, Request, Response} from 'express';
import {ErrorResponse} from 'hybrid-types/MessageTypes';
import CustomError from './classes/CustomError';
import jwt from 'jsonwebtoken';
import path from 'path';
import getVideoThumbnail from './utils/getVideoThumbnail';
import sharp from 'sharp';
import {TokenContent} from 'hybrid-types/DBTypes';

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
  res: Response<unknown, {user: TokenContent}>,
  next: NextFunction,
) => {
  console.log('authenticate');
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(new CustomError('Authentication failed 1', 401));
      return;
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as TokenContent;

    console.log(decodedToken);
    if (!decodedToken) {
      next(new CustomError('Authentication failed 2', 401));
      return;
    }

    res.locals.user = decodedToken;
    next();
  } catch (error) {
    next(new CustomError('Authentication failed 3', 401));
  }
};

const makeThumbnail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      next(new CustomError('File not uploaded', 500));
      return;
    }

    console.log('path', req.file.path);

    if (!req.file.mimetype.includes('video')) {
      sharp.cache(false);
      await sharp(req.file.path)
        .resize(320, 320)
        .png()
        .toFile(req.file.path + '-thumb.png')
        .catch((error) => {
          console.error('sharp error', error);
          next(new CustomError('Thumbnail not created by sharp', 500));
        });
      console.log('tn valmis');
      next();
      return;
    }

    await getVideoThumbnail(req.file.path);

    next();
  } catch (error) {
    next(new CustomError('Thumbnail not created', 500));
  }
};

// add user from res.locals to req.body to be accessed by multer
const addUserToBody = (
  req: Request,
  res: Response<unknown, {user: TokenContent}>,
  next: NextFunction,
) => {
  // prevent injection
  if (!req.body.user) {
    delete req.body.user;
  }
  req.body.user = res.locals.user;
  next();
};

export {notFound, errorHandler, authenticate, makeThumbnail, addUserToBody};
