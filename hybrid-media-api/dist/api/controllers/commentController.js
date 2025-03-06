"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentDelete = exports.commentPut = exports.commentPost = exports.commentGet = exports.commentCountByMediaIdGet = exports.commentListByUserGet = exports.commentListByMediaIdGet = exports.commentListGet = void 0;
const commentModel_1 = require("../models/commentModel");
// list of comments
const commentListGet = async (req, res, next) => {
    try {
        const comments = await (0, commentModel_1.fetchAllComments)();
        res.json(comments);
    }
    catch (error) {
        next(error);
    }
};
exports.commentListGet = commentListGet;
// list of comments by media item id
const commentListByMediaIdGet = async (req, res, next) => {
    try {
        const comments = await (0, commentModel_1.fetchCommentsByMediaId)(Number(req.params.id));
        res.json(comments);
    }
    catch (error) {
        next(error);
    }
};
exports.commentListByMediaIdGet = commentListByMediaIdGet;
// list of comments by user id
const commentListByUserGet = async (req, res, next) => {
    try {
        const comments = await (0, commentModel_1.fetchCommentsByUserId)(Number(res.locals.user.user_id));
        res.json(comments);
    }
    catch (error) {
        next(error);
    }
};
exports.commentListByUserGet = commentListByUserGet;
// list of comments count by media item id
const commentCountByMediaIdGet = async (req, res, next) => {
    try {
        const count = await (0, commentModel_1.fetchCommentsCountByMediaId)(Number(req.params.id));
        res.json({ count });
    }
    catch (error) {
        next(error);
    }
};
exports.commentCountByMediaIdGet = commentCountByMediaIdGet;
// Get a comment by id
const commentGet = async (req, res, next) => {
    try {
        const comment = await (0, commentModel_1.fetchCommentById)(Number(req.params.id));
        res.json(comment);
    }
    catch (error) {
        next(error);
    }
};
exports.commentGet = commentGet;
// Post a new comment
const commentPost = async (req, res, next) => {
    try {
        const result = await (0, commentModel_1.postComment)(Number(req.body.media_id), res.locals.user.user_id, req.body.comment_text);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.commentPost = commentPost;
// Update a comment
const commentPut = async (req, res, next) => {
    try {
        const result = await (0, commentModel_1.updateComment)(req.body.comment_text, Number(req.params.id), res.locals.user.user_id, res.locals.user.level_name);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.commentPut = commentPut;
// Delete a comment
const commentDelete = async (req, res, next) => {
    try {
        const result = await (0, commentModel_1.deleteComment)(Number(req.params.id), res.locals.user.user_id, res.locals.user.level_name);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.commentDelete = commentDelete;
//# sourceMappingURL=commentController.js.map