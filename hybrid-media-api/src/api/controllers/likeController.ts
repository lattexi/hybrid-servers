import {Request, Response, NextFunction} from 'express';
import {
  fetchAllLikes,
  fetchLikesByMediaId,
  fetchLikesByUserId,
  postLike,
  deleteLike,
  fetchLikesCountByMediaId,
  fetchLikeByMediaIdAndUserId,
} from '../models/likeModel';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import {Like, TokenContent} from 'hybrid-types/DBTypes';

const likeListGet = async (
  req: Request,
  res: Response<Like[]>,
  next: NextFunction,
) => {
  try {
    const likes = await fetchAllLikes();
    res.json(likes);
  } catch (error) {
    next(error);
  }
};

const likeListByMediaIdGet = async (
  req: Request<{media_id: string}>,
  res: Response<Like[]>,
  next: NextFunction,
) => {
  try {
    const likes = await fetchLikesByMediaId(Number(req.params.media_id));
    res.json(likes);
  } catch (error) {
    next(error);
  }
};

const likeListByUserIdGet = async (
  req: Request<{id: string}>,
  res: Response<Like[]>,
  next: NextFunction,
) => {
  try {
    const likes = await fetchLikesByUserId(Number(req.params.id));
    res.json(likes);
  } catch (error) {
    next(error);
  }
};

const likePost = async (
  req: Request<{}, {}, {media_id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await postLike(
      Number(req.body.media_id),
      res.locals.user.user_id,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const likeDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await deleteLike(
      Number(req.params.id),
      res.locals.user.user_id,
      res.locals.user.level_name,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Fetch likes count by media id
const likeCountByMediaIdGet = async (
  req: Request<{id: string}>,
  res: Response<{count: number}>,
  next: NextFunction,
) => {
  try {
    const count = await fetchLikesCountByMediaId(Number(req.params.id));
    res.json({count});
  } catch (error) {
    next(error);
  }
};

const likeByMediaIdAndUserIdGet = async (
  req: Request<{media_id: string}>,
  res: Response<Like, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await fetchLikeByMediaIdAndUserId(
      Number(req.params.media_id),
      res.locals.user.user_id,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  likeListGet,
  likeListByMediaIdGet,
  likeListByUserIdGet,
  likePost,
  likeDelete,
  likeCountByMediaIdGet,
  likeByMediaIdAndUserIdGet,
};
