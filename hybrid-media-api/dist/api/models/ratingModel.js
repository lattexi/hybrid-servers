"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRating = exports.postRating = exports.fetchAverageRatingByMediaId = exports.fetchRatingsByUserId = exports.fetchRatingsByMediaId = exports.fetchAllRatings = void 0;
const db_1 = __importDefault(require("../../lib/db"));
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
const errorMessages_1 = require("../../utils/errorMessages");
// Request a list of ratings
const fetchAllRatings = async () => {
    const [rows] = await db_1.default.execute('SELECT * FROM Ratings');
    return rows;
};
exports.fetchAllRatings = fetchAllRatings;
// Request a list of ratings by media item id
const fetchRatingsByMediaId = async (media_id) => {
    const [rows] = await db_1.default.execute('SELECT * FROM Ratings WHERE media_id = ?', [media_id]);
    return rows;
};
exports.fetchRatingsByMediaId = fetchRatingsByMediaId;
const fetchAverageRatingByMediaId = async (media_id) => {
    const [rows] = await db_1.default.execute('SELECT AVG(rating_value) as averageRating FROM Ratings WHERE media_id = ?', [media_id]);
    if (!rows[0].averageRating) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.RATING.NOT_FOUND_MEDIA, 404);
    }
    return rows[0].averageRating;
};
exports.fetchAverageRatingByMediaId = fetchAverageRatingByMediaId;
const fetchRatingsByUserId = async (user_id) => {
    const [rows] = await db_1.default.execute('SELECT * FROM Ratings WHERE user_id = ?', [user_id]);
    return rows;
};
exports.fetchRatingsByUserId = fetchRatingsByUserId;
// Post a new rating
const postRating = async (media_id, user_id, rating_value) => {
    const connection = await db_1.default.getConnection();
    try {
        await connection.beginTransaction();
        const [ratingExists] = await connection.execute('SELECT * FROM Ratings WHERE media_id = ? AND user_id = ? FOR UPDATE', [media_id, user_id]);
        if (ratingExists.length > 0) {
            const [deleteResult] = await connection.execute('DELETE FROM Ratings WHERE rating_id = ? AND user_id = ?', [ratingExists[0].rating_id, user_id]);
            if (deleteResult.affectedRows === 0) {
                throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.RATING.NOT_DELETED, 400);
            }
        }
        if (rating_value === 0) {
            await connection.commit();
            return { message: 'Rating deleted' };
        }
        const [ratingResult] = await connection.execute('INSERT INTO Ratings (media_id, user_id, rating_value) VALUES (?, ?, ?)', [media_id, user_id, rating_value]);
        if (ratingResult.affectedRows === 0) {
            throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.RATING.NOT_CREATED, 500);
        }
        await connection.commit();
        return { message: 'Rating added' };
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
};
exports.postRating = postRating;
// Delete a rating
const deleteRating = async (media_id, user_id, level_name) => {
    let sql = '';
    if (level_name === 'Admin') {
        sql = 'DELETE FROM Ratings WHERE rating_id = ?';
    }
    else {
        sql = 'DELETE FROM Ratings WHERE rating_id = ? AND user_id = ?';
    }
    const params = level_name === 'Admin' ? [media_id] : [media_id, user_id];
    const [result] = await db_1.default.execute(sql, params);
    if (result.affectedRows === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.RATING.NOT_DELETED, 404);
    }
    return { message: 'Rating deleted' };
};
exports.deleteRating = deleteRating;
//# sourceMappingURL=ratingModel.js.map