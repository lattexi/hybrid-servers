import {Request, Response, NextFunction} from 'express';
import {
  fetchAllComments,
  fetchCommentsByMediaId,
  fetchCommentsCountByMediaId,
  fetchCommentsByUserId,
  fetchCommentById,
  postComment,
  updateComment,
  deleteComment,
} from '../models/commentModel';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import {Comment, TokenContent} from 'hybrid-types/DBTypes';

// list of comments
const commentListGet = async (
  req: Request,
  res: Response<Comment[]>,
  next: NextFunction,
) => {
  try {
    const comments = await fetchAllComments();
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// list of comments by media item id
const commentListByMediaIdGet = async (
  req: Request<{id: string}>,
  res: Response<Comment[]>,
  next: NextFunction,
) => {
  try {
    const comments = await fetchCommentsByMediaId(Number(req.params.id));
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// list of comments by user id
const commentListByUserGet = async (
  req: Request,
  res: Response<Comment[], {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const comments = await fetchCommentsByUserId(
      Number(res.locals.user.user_id),
    );
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

// list of comments count by media item id
const commentCountByMediaIdGet = async (
  req: Request<{id: string}>,
  res: Response<{count: number}>,
  next: NextFunction,
) => {
  try {
    const count = await fetchCommentsCountByMediaId(Number(req.params.id));
    res.json({count});
  } catch (error) {
    next(error);
  }
};

// Get a comment by id
const commentGet = async (
  req: Request<{id: string}>,
  res: Response<Comment>,
  next: NextFunction,
) => {
  try {
    const comment = await fetchCommentById(Number(req.params.id));
    res.json(comment);
  } catch (error) {
    next(error);
  }
};

// Post a new comment
const commentPost = async (
  req: Request<{}, {}, {comment_text: string; media_id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await postComment(
      Number(req.body.media_id),
      res.locals.user.user_id,
      req.body.comment_text,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Update a comment
const commentPut = async (
  req: Request<{id: string}, {}, {comment_text: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await updateComment(
      req.body.comment_text,
      Number(req.params.id),
      res.locals.user.user_id,
      res.locals.user.level_name,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

// Delete a comment
const commentDelete = async (
  req: Request<{id: string}>,
  res: Response<MessageResponse, {user: TokenContent}>,
  next: NextFunction,
) => {
  try {
    const result = await deleteComment(
      Number(req.params.id),
      res.locals.user.user_id,
      res.locals.user.level_name,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export {
  commentListGet,
  commentListByMediaIdGet,
  commentListByUserGet,
  commentCountByMediaIdGet,
  commentGet,
  commentPost,
  commentPut,
  commentDelete,
};
