import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {Rating, UserLevel} from 'hybrid-types/DBTypes';
import promisePool from '../../lib/db';
import {MessageResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';
import {ERROR_MESSAGES} from '../../utils/errorMessages';

// Request a list of ratings
const fetchAllRatings = async (): Promise<Rating[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Rating[]>(
    'SELECT * FROM Ratings',
  );
  return rows;
};

// Request a list of ratings by media item id
const fetchRatingsByMediaId = async (media_id: number): Promise<Rating[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Rating[]>(
    'SELECT * FROM Ratings WHERE media_id = ?',
    [media_id],
  );
  return rows;
};

const fetchAverageRatingByMediaId = async (
  media_id: number,
): Promise<number> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & {averageRating: number}[]
  >(
    'SELECT AVG(rating_value) as averageRating FROM Ratings WHERE media_id = ?',
    [media_id],
  );
  if (!rows[0].averageRating) {
    throw new CustomError(ERROR_MESSAGES.RATING.NOT_FOUND_MEDIA, 404);
  }
  return rows[0].averageRating;
};

const fetchRatingsByUserId = async (user_id: number): Promise<Rating[]> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & Rating[]>(
    'SELECT * FROM Ratings WHERE user_id = ?',
    [user_id],
  );
  return rows;
};

// Post a new rating
const postRating = async (
  media_id: number,
  user_id: number,
  rating_value: number,
): Promise<MessageResponse> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const [ratingExists] = await connection.execute<RowDataPacket[] & Rating[]>(
      'SELECT * FROM Ratings WHERE media_id = ? AND user_id = ? FOR UPDATE',
      [media_id, user_id],
    );

    if (ratingExists.length > 0) {
      const [deleteResult] = await connection.execute<ResultSetHeader>(
        'DELETE FROM Ratings WHERE rating_id = ? AND user_id = ?',
        [ratingExists[0].rating_id, user_id],
      );
      if (deleteResult.affectedRows === 0) {
        throw new CustomError(ERROR_MESSAGES.RATING.NOT_DELETED, 400);
      }
    }

    if (rating_value === 0) {
      await connection.commit();
      return {message: 'Rating deleted'};
    }

    const [ratingResult] = await connection.execute<ResultSetHeader>(
      'INSERT INTO Ratings (media_id, user_id, rating_value) VALUES (?, ?, ?)',
      [media_id, user_id, rating_value],
    );

    if (ratingResult.affectedRows === 0) {
      throw new CustomError(ERROR_MESSAGES.RATING.NOT_CREATED, 500);
    }

    await connection.commit();
    return {message: 'Rating added'};
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Delete a rating
const deleteRating = async (
  media_id: number,
  user_id: number,
  level_name: UserLevel['level_name'],
): Promise<MessageResponse> => {
  let sql = '';
  if (level_name === 'Admin') {
    sql = 'DELETE FROM Ratings WHERE rating_id = ?';
  } else {
    sql = 'DELETE FROM Ratings WHERE rating_id = ? AND user_id = ?';
  }

  const params = level_name === 'Admin' ? [media_id] : [media_id, user_id];
  const [result] = await promisePool.execute<ResultSetHeader>(sql, params);

  if (result.affectedRows === 0) {
    throw new CustomError(ERROR_MESSAGES.RATING.NOT_DELETED, 404);
  }

  return {message: 'Rating deleted'};
};

export {
  fetchAllRatings,
  fetchRatingsByMediaId,
  fetchRatingsByUserId,
  fetchAverageRatingByMediaId,
  postRating,
  deleteRating,
};
