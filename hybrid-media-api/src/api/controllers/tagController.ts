import {Request, Response, NextFunction} from 'express';
import {
  fetchAllTags,
  postTag,
  fetchTagsByMediaId,
  fetchFilesByTagById,
  deleteTag,
  deleteTagFromMedia,
} from '../models/tagModel';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import {MediaItem, Tag, TagResult, TokenContent} from 'hybrid-types/DBTypes';
import CustomError from '../../classes/CustomError';

const tagListGet = async (
  req: Request,
  res: Response<Tag[]>,
  next: NextFunction,
) => {
  try {
    const tags = await fetchAllTags();
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

const tagListByMediaIdGet = async (
  req: Request<{id: string}>,
  res: Response<TagResult[]>,
  next: NextFunction,
) => {
  try {
    const tags = await fetchTagsByMediaId(Number(req.params.id));
    res.json(tags);
  } catch (error) {
    next(error);
  }
};

const tagPost = async (
  req: Request<{}, {}, {tag_name: string; media_id: string}>,
  res: Response<MessageResponse>,
  next: NextFunction,
) => {
  try {
    const result = await postTag(req.body.tag_name, Number(req.body.media_id));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const tagFilesByTagGet = async (
  req: Request<{tag_id: string}>,
  res: Response<MediaItem[]>,
  next: NextFunction,
) => {
  try {
    const files = await fetchFilesByTagById(Number(req.params.tag_id));
    res.json(files);
  } catch (error) {
    next(error);
  }
};

const tagDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    if (res.locals.user.level_name !== 'Admin') {
      throw new CustomError('Not authorized', 401);
    }
    const result = await deleteTag(Number(req.params.id));
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const tagDeleteFromMedia = async (
  req: Request<{tag_id: string; media_id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await deleteTagFromMedia(
      Number(req.params.tag_id),
      Number(req.params.media_id),
      res.locals.user.user_id,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  tagListGet,
  tagListByMediaIdGet,
  tagPost,
  tagDelete,
  tagFilesByTagGet,
  tagDeleteFromMedia,
};
