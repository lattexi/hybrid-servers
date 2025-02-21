import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Comment, UserLevel} from 'hybrid-types/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';
import {ERROR_MESSAGES} from '../../utils/errorMessages';

// Request a list of comments
const fetchAllComments = async (): Promise<Comment[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
    'SELECT * FROM Comments',
  );
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_FOUND, 404);
  }
  return rows;
};

// Request a list of comments by media item id
const fetchCommentsByMediaId = async (id: number): Promise<Comment[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
    'SELECT * FROM Comments WHERE media_id = ?',
    [id],
  );
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_FOUND_MEDIA, 404);
  }
  return rows;
};

// Request a count of comments by media item id
const fetchCommentsCountByMediaId = async (id: number): Promise<number> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & {commentsCount: number}[]
  >('SELECT COUNT(*) as commentsCount FROM Comments WHERE media_id = ?', [id]);
  return rows[0].commentsCount;
};

// Request a list of comments by user id
const fetchCommentsByUserId = async (id: number): Promise<Comment[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
    'SELECT * FROM Comments WHERE user_id = ?',
    [id],
  );
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_FOUND_USER, 404);
  }
  return rows;
};

// Request a comment by id
const fetchCommentById = async (id: number): Promise<Comment> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Comment[]>(
    'SELECT * FROM Comments WHERE comment_id = ?',
    [id],
  );
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_FOUND, 404);
  }
  return rows[0];
};

// Create a new comment
const postComment = async (
  media_id: number,
  user_id: number,
  comment_text: string,
): Promise<MessageResponse> => {
  const [result] = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO Comments (media_id, user_id, comment_text) VALUES (?, ?, ?)',
    [media_id, user_id, comment_text],
  );
  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_CREATED, 500);
  }
  return {message: 'Comment added'};
};

// Update a comment
const updateComment = async (
  comment_text: string,
  comment_id: number,
  user_id: number,
  user_level: UserLevel['level_name'],
): Promise<MessageResponse> => {
  let sql = '';
  if (user_level === 'Admin') {
    sql = 'UPDATE Comments SET comment_text = ? WHERE comment_id = ?';
  } else {
    sql =
      'UPDATE Comments SET comment_text = ? WHERE comment_id = ? AND user_id = ?';
  }
  const params =
    user_level === 'Admin'
      ? [comment_text, comment_id]
      : [comment_text, comment_id, user_id];

  const [result] = await promisePool.execute<ResultSetHeader>(sql, params);

  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_UPDATED, 404);
  }
  return {message: 'Comment updated'};
};

// Delete a comment
const deleteComment = async (
  id: number,
  user_id: number,
  user_level: UserLevel['level_name'],
): Promise<MessageResponse> => {
  let sql = '';
  if (user_level === 'Admin') {
    sql = 'DELETE FROM Comments WHERE comment_id = ?';
  } else {
    sql = 'DELETE FROM Comments WHERE comment_id = ? AND user_id = ?';
  }
  const params = user_level === 'Admin' ? [id] : [id, user_id];

  const [result] = await promisePool.execute<ResultSetHeader>(sql, params);

  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.COMMENT.NOT_DELETED, 404);
  }
  return {message: 'Comment deleted'};
};

export {
  fetchAllComments,
  fetchCommentsByMediaId,
  fetchCommentsCountByMediaId,
  fetchCommentsByUserId,
  fetchCommentById,
  postComment,
  updateComment,
  deleteComment,
};
