"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.updateComment = exports.postComment = exports.fetchCommentById = exports.fetchCommentsByUserId = exports.fetchCommentsCountByMediaId = exports.fetchCommentsByMediaId = exports.fetchAllComments = void 0;
const db_1 = __importDefault(require("../../lib/db"));
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
const errorMessages_1 = require("../../utils/errorMessages");
// Request a list of comments
const fetchAllComments = async () => {
    const [rows] = await db_1.default.execute('SELECT * FROM Comments');
    if (rows.length === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.COMMENT.NOT_FOUND, 404);
    }
    return rows;
};
exports.fetchAllComments = fetchAllComments;
// Request a list of comments by media item id
const fetchCommentsByMediaId = async (id) => {
    const [rows] = await db_1.default.execute('SELECT * FROM Comments WHERE media_id = ?', [id]);
    if (rows.length === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.COMMENT.NOT_FOUND_MEDIA, 404);
    }
    return rows;
};
exports.fetchCommentsByMediaId = fetchCommentsByMediaId;
// Request a count of comments by media item id
const fetchCommentsCountByMediaId = async (id) => {
    const [rows] = await db_1.default.execute('SELECT COUNT(*) as commentsCount FROM Comments WHERE media_id = ?', [id]);
    return rows[0].commentsCount;
};
exports.fetchCommentsCountByMediaId = fetchCommentsCountByMediaId;
// Request a list of comments by user id
const fetchCommentsByUserId = async (id) => {
    const [rows] = await db_1.default.execute('SELECT * FROM Comments WHERE user_id = ?', [id]);
    if (rows.length === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.COMMENT.NOT_FOUND_USER, 404);
    }
    return rows;
};
exports.fetchCommentsByUserId = fetchCommentsByUserId;
// Request a comment by id
const fetchCommentById = async (id) => {
    const [rows] = await db_1.default.execute('SELECT * FROM Comments WHERE comment_id = ?', [id]);
    if (rows.length === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.COMMENT.NOT_FOUND, 404);
    }
    return rows[0];
};
exports.fetchCommentById = fetchCommentById;
// Create a new comment
const postComment = async (media_id, user_id, comment_text) => {
    const [result] = await db_1.default.execute('INSERT INTO Comments (media_id, user_id, comment_text) VALUES (?, ?, ?)', [media_id, user_id, comment_text]);
    if (result.affectedRows === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.COMMENT.NOT_CREATED, 500);
    }
    return { message: 'Comment added' };
};
exports.postComment = postComment;
// Update a comment
const updateComment = async (comment_text, comment_id, user_id, user_level) => {
    let sql = '';
    if (user_level === 'Admin') {
        sql = 'UPDATE Comments SET comment_text = ? WHERE comment_id = ?';
    }
    else {
        sql =
            'UPDATE Comments SET comment_text = ? WHERE comment_id = ? AND user_id = ?';
    }
    const params = user_level === 'Admin'
        ? [comment_text, comment_id]
        : [comment_text, comment_id, user_id];
    const [result] = await db_1.default.execute(sql, params);
    if (result.affectedRows === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.COMMENT.NOT_UPDATED, 404);
    }
    return { message: 'Comment updated' };
};
exports.updateComment = updateComment;
// Delete a comment
const deleteComment = async (id, user_id, user_level) => {
    let sql = '';
    if (user_level === 'Admin') {
        sql = 'DELETE FROM Comments WHERE comment_id = ?';
    }
    else {
        sql = 'DELETE FROM Comments WHERE comment_id = ? AND user_id = ?';
    }
    const params = user_level === 'Admin' ? [id] : [id, user_id];
    const [result] = await db_1.default.execute(sql, params);
    if (result.affectedRows === 0) {
        throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.COMMENT.NOT_DELETED, 404);
    }
    return { message: 'Comment deleted' };
};
exports.deleteComment = deleteComment;
//# sourceMappingURL=commentModel.js.map