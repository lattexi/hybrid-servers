import {Request, Response, NextFunction} from 'express';
import {
  fetchAllMedia,
  fetchMediaById,
  postMedia,
  deleteMedia,
  fetchMostLikedMedia,
  fetchMediaByUserId,
  putMedia,
} from '../models/mediaModel';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import {MediaItem, TokenContent} from 'hybrid-types/DBTypes';
import CustomError from '../../classes/CustomError';
import {ERROR_MESSAGES} from '../../utils/errorMessages';

const mediaListGet = async (
  req: Request<{}, {}, {page: string; limit: string}>,
  res: Response<MediaItem[]>,
  next: NextFunction,
) => {
  try {
    const {page, limit} = req.query;
    const media = await fetchAllMedia(Number(page), Number(limit));
    res.json(media);
  } catch (error) {
    next(error);
  }
};

const mediaGet = async (
  req: Request<{id: string}>,
  res: Response<MediaItem>,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const media = await fetchMediaById(id);
    res.json(media);
  } catch (error) {
    next(error);
  }
};

const mediaPost = async (
  req: Request<{}, {}, Omit<MediaItem, 'media_id' | 'created_at'>>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    // add user_id to media object from token
    req.body.user_id = res.locals.user.user_id;
    await postMedia(req.body);
    res.json({message: 'Media created'});
  } catch (error) {
    next(error);
  }
};

const mediaDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenContent; token: string}>,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    const result = await deleteMedia(
      id,
      res.locals.user.user_id,
      res.locals.token,
      res.locals.user.level_name,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const mediaPut = async (
  req: Request<{id: string}, {}, Pick<MediaItem, 'title' | 'description'>>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id);
    await putMedia(
      req.body,
      id,
      res.locals.user.user_id,
      res.locals.user.level_name,
    );
    res.json({message: 'Media updated'});
  } catch (error) {
    next(error);
  }
};

const mediaByUserGet = async (
  req: Request<{id: string}>,
  res: Response<MediaItem[], {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const id = Number(req.params.id) || res.locals.user.user_id;
    if (isNaN(id)) {
      throw new CustomError(ERROR_MESSAGES.MEDIA.NO_ID, 400);
    }

    const media = await fetchMediaByUserId(id);
    res.json(media);
  } catch (error) {
    next(error);
  }
};

const mediaListMostLikedGet = async (
  req: Request,
  res: Response<MediaItem>,
  next: NextFunction,
) => {
  try {
    const media = await fetchMostLikedMedia();
    res.json(media);
  } catch (error) {
    next(error);
  }
};

export {
  mediaListGet,
  mediaGet,
  mediaPost,
  mediaPut,
  mediaDelete,
  mediaByUserGet,
  mediaListMostLikedGet,
};
