"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTagFromMedia = exports.deleteTag = exports.fetchFilesByTagById = exports.fetchTagsByMediaId = exports.postTag = exports.fetchAllTags = void 0;
const db_1 = __importDefault(require("../../lib/db"));
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
const errorMessages_1 = require("../../utils/errorMessages");
// Request a list of tags
const fetchAllTags = async () => {
    const [rows] = await db_1.default.execute('SELECT * FROM Tags');
    return rows;
};
exports.fetchAllTags = fetchAllTags;
const fetchFilesByTagById = async (tag_id) => {
    const [rows] = await db_1.default.execute(`SELECT * FROM MediaItems
     JOIN MediaItemTags ON MediaItems.media_id = MediaItemTags.media_id
     WHERE MediaItemTags.tag_id = ?`, [tag_id]);
    return rows;
};
exports.fetchFilesByTagById = fetchFilesByTagById;
// Post a new tag
const postTag = async (tag_name, media_id) => {
    let tag_id = 0;
    // check if tag exists (case insensitive)
    const [tagResult] = await db_1.default.query('SELECT tag_id FROM Tags WHERE tag_name = ?', [tag_name]);
    if (tagResult.length === 0) {
        // if tag does not exist create it
        const [insertResult] = await db_1.default.execute('INSERT INTO Tags (tag_name) VALUES (?)', [tag_name]);
        tag_id = insertResult.insertId;
    }
    else {
        tag_id = tagResult[0].tag_id;
    }
    const [result] = await db_1.default.execute('INSERT INTO MediaItemTags (tag_id, media_id) VALUES (?, ?)', [tag_id, media_id]);
    if (result.affectedRows === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.TAG.NOT_CREATED, 500);
    }
    return { message: 'Tag added' };
};
exports.postTag = postTag;
// Request a list of tags by media item id
const fetchTagsByMediaId = async (id) => {
    const [rows] = await db_1.default.execute(`SELECT Tags.tag_id, Tags.tag_name, MediaItemTags.media_id
     FROM Tags
     JOIN MediaItemTags ON Tags.tag_id = MediaItemTags.tag_id
     WHERE MediaItemTags.media_id = ?`, [id]);
    return rows;
};
exports.fetchTagsByMediaId = fetchTagsByMediaId;
// Delete a tag
const deleteTag = async (id) => {
    const connection = await db_1.default.getConnection();
    await connection.beginTransaction();
    try {
        const [result1] = await connection.execute('DELETE FROM MediaItemTags WHERE tag_id = ?', [id]);
        const [result2] = await connection.execute('DELETE FROM Tags WHERE tag_id = ?', [id]);
        if (result1.affectedRows === 0 && result2.affectedRows === 0) {
            throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.TAG.NOT_DELETED, 404);
        }
        await connection.commit();
        return { message: 'Tag deleted' };
    }
    catch (error) {
        await connection.rollback();
        throw error;
    }
    finally {
        connection.release();
    }
};
exports.deleteTag = deleteTag;
const deleteTagFromMedia = async (tag_id, media_id, user_id) => {
    // check if user owns media item
    const [mediaItem] = await db_1.default.execute('SELECT * FROM MediaItems WHERE media_id = ? AND user_id = ?', [media_id, user_id]);
    if (mediaItem.length === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.TAG.NOT_AUTHORIZED, 401);
    }
    const [result] = await db_1.default.execute('DELETE FROM MediaItemTags WHERE tag_id = ? AND media_id = ?', [tag_id, media_id]);
    if (result.affectedRows === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.TAG.NOT_DELETED, 404);
    }
    return { message: 'Tag deleted from media item' };
};
exports.deleteTagFromMedia = deleteTagFromMedia;
//# sourceMappingURL=tagModel.js.map