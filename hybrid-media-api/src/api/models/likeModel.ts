import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Like, UserLevel} from 'hybrid-types/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';
import {ERROR_MESSAGES} from '../../utils/errorMessages';

// Request a list of likes
const fetchAllLikes = async (): Promise<Like[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes',
  );
  return rows;
};

// Request a list of likes by media item id
const fetchLikesByMediaId = async (id: number): Promise<Like[]> => {
  console.log('SELECT * FROM Likes WHERE media_id = ' + id);
  const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes WHERE media_id = ?',
    [id],
  );
  return rows;
};

// Request a count of likes by media item id
const fetchLikesCountByMediaId = async (id: number): Promise<number> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & {likesCount: number}[]
  >('SELECT COUNT(*) as likesCount FROM Likes WHERE media_id = ?', [id]);
  return rows[0].likesCount;
};

// Request a list of likes by user id
const fetchLikesByUserId = async (id: number): Promise<Like[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes WHERE user_id = ?',
    [id],
  );
  return rows;
};

// Post a new like
const postLike = async (
  media_id: number,
  user_id: number,
): Promise<MessageResponse> => {
  const [existingLike] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes WHERE media_id = ? AND user_id = ?',
    [media_id, user_id],
  );

  if (existingLike.length > 0) {
    throw new CustomError(ERROR_MESSAGES.LIKE.ALREADY_EXISTS, 400);
  }

  const result = await promisePool.execute<ResultSetHeader>(
    'INSERT INTO Likes (media_id, user_id) VALUES (?, ?)',
    [media_id, user_id],
  );

  if (result[0].affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.LIKE.NOT_CREATED, 500);
  }

  return {message: 'Like added'};
};

// Delete a like
const deleteLike = async (
  like_id: number,
  user_id: number,
  user_level: UserLevel['level_name'],
): Promise<MessageResponse> => {
  const sql =
    user_level === 'Admin'
      ? 'DELETE FROM Likes WHERE like_id = ?'
      : 'DELETE FROM Likes WHERE like_id = ? AND user_id = ?';

  const params = user_level === 'Admin' ? [like_id] : [like_id, user_id];

  const [result] = await promisePool.execute<ResultSetHeader>(sql, params);

  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.LIKE.NOT_DELETED, 400);
  }

  return {message: 'Like deleted'};
};

const fetchLikeByMediaIdAndUserId = async (
  media_id: number,
  user_id: number,
): Promise<Like> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes WHERE media_id = ? AND user_id = ?',
    [media_id, user_id],
  );
  if (rows.length === 0) {
    throw new CustomError(ERROR_MESSAGES.LIKE.NOT_FOUND, 404);
  }
  return rows[0];
};

const getLikesByMediaId = async (media_id: number): Promise<Like[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Like[]>(
    'SELECT * FROM Likes WHERE media_id = ?',
    [media_id],
  );
  return rows;
};

export {
  fetchAllLikes,
  fetchLikesByMediaId,
  fetchLikesByUserId,
  postLike,
  deleteLike,
  fetchLikesCountByMediaId,
  fetchLikeByMediaIdAndUserId,
  getLikesByMediaId,
};
