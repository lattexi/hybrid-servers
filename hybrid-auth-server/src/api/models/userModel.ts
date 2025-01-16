import {ResultSetHeader, RowDataPacket} from 'mysql2';
import {promisePool} from '../../lib/db';
import {UserWithLevel, User, UserWithNoPassword} from 'hybrid-types/DBTypes';
import {UserDeleteResponse} from 'hybrid-types/MessageTypes';
import CustomError from '../../classes/CustomError';

const getUserById = async (id: number): Promise<UserWithNoPassword> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & UserWithNoPassword[]
  >(
    `SELECT Users.user_id, Users.username, Users.email, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
     WHERE Users.user_id = ?`,
    [id],
  );
  if (rows.length === 0) {
    throw new CustomError('User not found', 404);
  }
  return rows[0];
};

const getAllUsers = async (): Promise<UserWithNoPassword[]> => {
  const [rows] = await promisePool.execute<
    RowDataPacket[] & UserWithNoPassword[]
  >(
    `SELECT Users.user_id, Users.username, Users.email, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id`,
  );
  return rows; // Return empty array if no users found
};

const getUserByEmail = async (email: string): Promise<UserWithLevel> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
    `SELECT Users.user_id, Users.username, Users.password, Users.email, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
     WHERE Users.email = ?`,
    [email],
  );
  if (rows.length === 0) {
    throw new CustomError('User not found', 404);
  }
  return rows[0];
};

const getUserByUsername = async (username: string): Promise<UserWithLevel> => {
  const [rows] = await promisePool.execute<RowDataPacket[] & UserWithLevel[]>(
    `SELECT Users.user_id, Users.username, Users.password, Users.email, Users.created_at, UserLevels.level_name
     FROM Users
     JOIN UserLevels ON Users.user_level_id = UserLevels.level_id
     WHERE Users.username = ?`,
    [username],
  );
  if (rows.length === 0) {
    throw new CustomError('User not found', 404);
  }
  return rows[0];
};

const createUser = async (
  user: Pick<User, 'username' | 'password' | 'email'>,
  userLevelId = 2,
): Promise<UserWithNoPassword> => {
  const sql = `INSERT INTO Users (username, password, email, user_level_id)
       VALUES (?, ?, ?, ?)`;
  const stmt = promisePool.format(sql, [
    user.username,
    user.password,
    user.email,
    userLevelId,
  ]);
  const [result] = await promisePool.execute<ResultSetHeader>(stmt);

  if (result.affectedRows === 0) {
    throw new CustomError('Failed to create user', 500);
  }

  return await getUserById(result.insertId);
};

const modifyUser = async (
  user: Partial<User>,
  id: number,
): Promise<UserWithNoPassword> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();

    const allowedFields = ['username', 'email', 'password', 'user_level_id'];
    const updates = Object.entries(user)
      .filter(([key]) => allowedFields.includes(key))
      .map(([key, value]) => `${key} = ?`);
    const values = Object.entries(user)
      .filter(([key]) => allowedFields.includes(key))
      .map(([, value]) => value);

    if (updates.length === 0) {
      throw new CustomError('No valid fields to update', 400);
    }

    const [result] = await connection.execute<ResultSetHeader>(
      `UPDATE Users SET ${updates.join(', ')} WHERE user_id = ?`,
      [...values, id],
    );

    if (result.affectedRows === 0) {
      throw new CustomError('User not found', 404);
    }

    const updatedUser = await getUserById(id);
    await connection.commit();
    return updatedUser;
  } finally {
    connection.release();
  }
};

const deleteUser = async (id: number): Promise<UserDeleteResponse> => {
  const connection = await promisePool.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute('DELETE FROM Comments WHERE user_id = ?;', [id]);
    await connection.execute('DELETE FROM Likes WHERE user_id = ?;', [id]);
    await connection.execute('DELETE FROM Ratings WHERE user_id = ?;', [id]);
    await connection.execute(
      'DELETE FROM Comments WHERE media_id IN (SELECT media_id FROM MediaItems WHERE user_id = ?);',
      [id],
    );
    await connection.execute(
      'DELETE FROM Likes WHERE media_id IN (SELECT media_id FROM MediaItems WHERE user_id = ?);',
      [id],
    );
    await connection.execute(
      'DELETE FROM Ratings WHERE media_id IN (SELECT media_id FROM MediaItems WHERE user_id = ?);',
      [id],
    );
    await connection.execute(
      'DELETE FROM MediaItemTags WHERE media_id IN (SELECT media_id FROM MediaItems WHERE user_id = ?);',
      [id],
    );
    await connection.execute('DELETE FROM MediaItems WHERE user_id = ?;', [id]);
    const [result] = await connection.execute<ResultSetHeader>(
      'DELETE FROM Users WHERE user_id = ?;',
      [id],
    );

    await connection.commit();

    if (result.affectedRows === 0) {
      throw new CustomError('User not found', 404);
    }

    console.log('result', result);
    return {message: 'User deleted', user: {user_id: id}};
  } finally {
    connection.release();
  }
};

export {
  getUserById,
  getAllUsers,
  getUserByEmail,
  getUserByUsername,
  createUser,
  modifyUser,
  deleteUser,
};
