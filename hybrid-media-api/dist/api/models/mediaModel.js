"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putMedia = exports.fetchMediaByUserId = exports.fetchMostLikedMedia = exports.deleteMedia = exports.postMedia = exports.fetchMediaById = exports.fetchAllMedia = void 0;
const errorMessages_1 = require("../../utils/errorMessages");
const db_1 = __importDefault(require("../../lib/db"));
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
const functions_1 = require("../../lib/functions");
const uploadPath = process.env.UPLOAD_URL;
// Common SQL fragments
// if mediaItem is an image add '-thumb.png' to filename
// if mediaItem is not image add screenshots property with 5 thumbnails
// uploadPath needs to be passed to the query
// Example usage:
// ....execute(BASE_MEDIA_QUERY, [uploadPath, otherParams]);
const BASE_MEDIA_QUERY = `
  SELECT
    media_id,
    user_id,
    filename,
    filesize,
    media_type,
    title,
    description,
    created_at,
    CONCAT(base_url, filename) AS filename,
    CASE
      WHEN media_type LIKE '%image%'
      THEN CONCAT(base_url, filename, '-thumb.png')
      ELSE NULL
    END AS thumbnail,
    CASE
      WHEN media_type NOT LIKE '%image%'
      THEN (
        SELECT JSON_ARRAY(
          CONCAT(base_url, filename, '-thumb-1.png'),
          CONCAT(base_url, filename, '-thumb-2.png'),
          CONCAT(base_url, filename, '-thumb-3.png'),
          CONCAT(base_url, filename, '-thumb-4.png'),
          CONCAT(base_url, filename, '-thumb-5.png')
        )
      )
      ELSE NULL
    END AS screenshots
  FROM MediaItems,
       (SELECT ? AS base_url) AS vars
`;
const fetchAllMedia = async (page = undefined, limit = undefined) => {
    console.log('fetchAllMedia', page, limit);
    const offset = ((page || 1) - 1) * (limit || 10);
    const sql = `${BASE_MEDIA_QUERY}
    ORDER BY created_at DESC
    ${limit ? 'LIMIT ? OFFSET ?' : ''}`;
    console.log('sql', sql);
    const params = limit ? [uploadPath, limit, offset] : [uploadPath];
    const stmt = db_1.default.format(sql, params);
    const [rows] = await db_1.default.execute(stmt);
    return rows;
};
exports.fetchAllMedia = fetchAllMedia;
const fetchMediaById = async (id) => {
    const sql = `${BASE_MEDIA_QUERY}
              WHERE media_id=?`;
    const params = [uploadPath, id];
    const stmt = db_1.default.format(sql, params);
    console.log(stmt);
    const [rows] = await db_1.default.execute(stmt);
    if (rows.length === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.MEDIA.NOT_FOUND, 404);
    }
    return rows[0];
};
exports.fetchMediaById = fetchMediaById;
const postMedia = async (media) => {
    const { user_id, filename, filesize, media_type, title, description } = media;
    const sql = `INSERT INTO MediaItems (user_id, filename, filesize, media_type, title, description)
               VALUES (?, ?, ?, ?, ?, ?)`;
    const params = [user_id, filename, filesize, media_type, title, description];
    const stmt = db_1.default.format(sql, params);
    console.log(stmt);
    const [result] = await db_1.default.execute(stmt);
    console.log('postMedia', result);
    if (result.affectedRows === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.MEDIA.NOT_CREATED, 500);
    }
    return await fetchMediaById(result.insertId);
};
exports.postMedia = postMedia;
const putMedia = async (media, id, user_id, user_level) => {
    const sql = user_level === 'Admin'
        ? 'UPDATE MediaItems SET title = ?, description = ? WHERE media_id = ?'
        : 'UPDATE MediaItems SET title = ?, description = ? WHERE media_id = ? AND user_id = ?';
    const params = user_level === 'Admin'
        ? [media.title, media.description, id]
        : [media.title, media.description, id, user_id];
    const stmt = db_1.default.format(sql, params);
    const [result] = await db_1.default.execute(stmt);
    if (result.affectedRows === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.MEDIA.NOT_UPDATED, 404);
    }
    return await fetchMediaById(id);
};
exports.putMedia = putMedia;
const deleteMedia = async (media_id, user_id, token, level_name) => {
    const media = await fetchMediaById(media_id);
    if (!media) {
        return { message: 'Media not found' };
    }
    media.filename = media?.filename.replace(process.env.UPLOAD_URL, '');
    const connection = await db_1.default.getConnection();
    await connection.beginTransaction();
    await connection.execute('DELETE FROM Likes WHERE media_id = ?;', [media_id]);
    await connection.execute('DELETE FROM Comments WHERE media_id = ?;', [
        media_id,
    ]);
    await connection.execute('DELETE FROM Ratings WHERE media_id = ?;', [
        media_id,
    ]);
    await connection.execute('DELETE FROM MediaItemTags WHERE media_id = ?;', [
        media_id,
    ]);
    const sql = level_name === 'Admin'
        ? connection.format('DELETE FROM MediaItems WHERE media_id = ?', [
            media_id,
        ])
        : connection.format('DELETE FROM MediaItems WHERE media_id = ? AND user_id = ?', [media_id, user_id]);
    const [result] = await connection.execute(sql);
    if (result.affectedRows === 0) {
        return { message: 'Media not deleted' };
    }
    const options = {
        method: 'DELETE',
        headers: {
            Authorization: 'Bearer ' + token,
        },
    };
    try {
        const deleteResult = await (0, functions_1.fetchData)(`${process.env.UPLOAD_SERVER}/delete/${media.filename}`, options);
        console.log('deleteResult', deleteResult);
    }
    catch (e) {
        console.error('deleteMedia file delete error:', e.message);
    }
    await connection.commit();
    return {
        message: 'Media deleted',
    };
};
exports.deleteMedia = deleteMedia;
const fetchMediaByUserId = async (user_id) => {
    const sql = `${BASE_MEDIA_QUERY} WHERE user_id = ?`;
    const params = [uploadPath, user_id];
    const stmt = db_1.default.format(sql, params);
    console.log(stmt);
    const [rows] = await db_1.default.execute(stmt);
    return rows;
};
exports.fetchMediaByUserId = fetchMediaByUserId;
const fetchMostLikedMedia = async () => {
    // you could also use a view for this
    const sql = `${BASE_MEDIA_QUERY}
     WHERE media_id = (
       SELECT media_id FROM Likes
       GROUP BY media_id
       ORDER BY COUNT(*) DESC
       LIMIT 1
     )`;
    const params = [uploadPath];
    const stmt = db_1.default.format(sql, params);
    console.log(stmt);
    const [rows] = await db_1.default.execute(stmt);
    if (!rows.length) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.MEDIA.NOT_FOUND_LIKED, 404);
    }
    return rows[0];
};
exports.fetchMostLikedMedia = fetchMostLikedMedia;
//# sourceMappingURL=mediaModel.js.map