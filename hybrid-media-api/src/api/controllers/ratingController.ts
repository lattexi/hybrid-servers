import {Request, Response, NextFunction} from 'express';
import {
  fetchAllRatings,
  fetchRatingsByMediaId,
  fetchRatingsByUserId,
  fetchAverageRatingByMediaId,
  postRating,
  deleteRating,
} from '../models/ratingModel';
import CustomError from '../../classes/CustomError';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import {Rating, TokenContent} from 'hybrid-types/DBTypes';

// list of ratings
const ratingListGet = async (
  req: Request,
  res: Response<Rating[]>,
  next: NextFunction,
) => {
  try {
    const ratings = await fetchAllRatings();
    res.json(ratings);
  } catch (error) {
    next(error);
  }
};

// list of ratings by media item id
const ratingListByMediaIdGet = async (
  req: Request<{id: string}>,
  res: Response<Rating[]>,
  next: NextFunction,
) => {
  try {
    const ratings = await fetchRatingsByMediaId(Number(req.params.id));
    res.json(ratings);
  } catch (error) {
    next(error);
  }
};

// list of ratings by user id
const ratingListByUserGet = async (
  req: Request,
  res: Response<Rating[], {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const ratings = await fetchRatingsByUserId(Number(res.locals.user.user_id));
    if (ratings) {
      res.json(ratings);
      return;
    }
    next(new CustomError('No ratings found', 404));
  } catch (error) {
    next(error);
  }
};

// Post a new rating
const ratingPost = async (
  req: Request<{}, {}, {rating_value: string; media_id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await postRating(
      Number(req.body.rating_value),
      res.locals.user.user_id,
      Number(req.body.media_id),
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Rating not created', 500));
  } catch (error) {
    next(error);
  }
};

// Delete a rating
const ratingDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await deleteRating(
      Number(req.params.id),
      res.locals.user.user_id,
      res.locals.user.level_name,
    );
    if (result) {
      res.json(result);
      return;
    }
    next(new CustomError('Rating not deleted', 500));
  } catch (error) {
    next(error);
  }
};

const ratingAverageByMediaIdGet = async (
  req: Request<{id: string}>,
  res: Response<{average: number}>,
  next: NextFunction,
) => {
  try {
    const average = await fetchAverageRatingByMediaId(Number(req.params.id));
    if (average) {
      res.json({average});
      return;
    }
    next(new CustomError('No ratings found', 404));
  } catch (error) {
    next(error);
  }
};

export {
  ratingListGet,
  ratingListByMediaIdGet,
  ratingListByUserGet,
  ratingPost,
  ratingDelete,
  ratingAverageByMediaIdGet,
};
