"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikesByMediaId = exports.fetchLikeByMediaIdAndUserId = exports.fetchLikesCountByMediaId = exports.deleteLike = exports.postLike = exports.fetchLikesByUserId = exports.fetchLikesByMediaId = exports.fetchAllLikes = void 0;
const db_1 = __importDefault(require("../../lib/db"));
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
const errorMessages_1 = require("../../utils/errorMessages");
// Request a list of likes
const fetchAllLikes = async () => {
    const [rows] = await db_1.default.execute('SELECT * FROM Likes');
    return rows;
};
exports.fetchAllLikes = fetchAllLikes;
// Request a list of likes by media item id
const fetchLikesByMediaId = async (id) => {
    console.log('SELECT * FROM Likes WHERE media_id = ' + id);
    const [rows] = await db_1.default.execute('SELECT * FROM Likes WHERE media_id = ?', [id]);
    return rows;
};
exports.fetchLikesByMediaId = fetchLikesByMediaId;
// Request a count of likes by media item id
const fetchLikesCountByMediaId = async (id) => {
    const [rows] = await db_1.default.execute('SELECT COUNT(*) as likesCount FROM Likes WHERE media_id = ?', [id]);
    return rows[0].likesCount;
};
exports.fetchLikesCountByMediaId = fetchLikesCountByMediaId;
// Request a list of likes by user id
const fetchLikesByUserId = async (id) => {
    const [rows] = await db_1.default.execute('SELECT * FROM Likes WHERE user_id = ?', [id]);
    return rows;
};
exports.fetchLikesByUserId = fetchLikesByUserId;
// Post a new like
const postLike = async (media_id, user_id) => {
    const [existingLike] = await db_1.default.execute('SELECT * FROM Likes WHERE media_id = ? AND user_id = ?', [media_id, user_id]);
    if (existingLike.length > 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.LIKE.ALREADY_EXISTS, 400);
    }
    const result = await db_1.default.execute('INSERT INTO Likes (media_id, user_id) VALUES (?, ?)', [media_id, user_id]);
    if (result[0].affectedRows === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.LIKE.NOT_CREATED, 500);
    }
    return { message: 'Like added' };
};
exports.postLike = postLike;
// Delete a like
const deleteLike = async (like_id, user_id, user_level) => {
    const sql = user_level === 'Admin'
        ? 'DELETE FROM Likes WHERE like_id = ?'
        : 'DELETE FROM Likes WHERE like_id = ? AND user_id = ?';
    const params = user_level === 'Admin' ? [like_id] : [like_id, user_id];
    const [result] = await db_1.default.execute(sql, params);
    if (result.affectedRows === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.LIKE.NOT_DELETED, 400);
    }
    return { message: 'Like deleted' };
};
exports.deleteLike = deleteLike;
const fetchLikeByMediaIdAndUserId = async (media_id, user_id) => {
    const [rows] = await db_1.default.execute('SELECT * FROM Likes WHERE media_id = ? AND user_id = ?', [media_id, user_id]);
    if (rows.length === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.LIKE.NOT_FOUND, 404);
    }
    return rows[0];
};
exports.fetchLikeByMediaIdAndUserId = fetchLikeByMediaIdAndUserId;
const getLikesByMediaId = async (media_id) => {
    const [rows] = await db_1.default.execute('SELECT * FROM Likes WHERE media_id = ?', [media_id]);
    return rows;
};
exports.getLikesByMediaId = getLikesByMediaId;
//# sourceMappingURL=likeModel.js.map