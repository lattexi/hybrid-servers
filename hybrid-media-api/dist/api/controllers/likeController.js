"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeByMediaIdAndUserIdGet = exports.likeCountByMediaIdGet = exports.likeDelete = exports.likePost = exports.likeListByUserIdGet = exports.likeListByMediaIdGet = exports.likeListGet = void 0;
const likeModel_1 = require("../models/likeModel");
const likeListGet = async (req, res, next) => {
    try {
        const likes = await (0, likeModel_1.fetchAllLikes)();
        res.json(likes);
    }
    catch (error) {
        next(error);
    }
};
exports.likeListGet = likeListGet;
const likeListByMediaIdGet = async (req, res, next) => {
    try {
        const likes = await (0, likeModel_1.fetchLikesByMediaId)(Number(req.params.media_id));
        res.json(likes);
    }
    catch (error) {
        next(error);
    }
};
exports.likeListByMediaIdGet = likeListByMediaIdGet;
const likeListByUserIdGet = async (req, res, next) => {
    try {
        const user_id = req.params.id
            ? Number(req.params.id)
            : res.locals.user.user_id;
        const likes = await (0, likeModel_1.fetchLikesByUserId)(user_id);
        res.json(likes);
    }
    catch (error) {
        next(error);
    }
};
exports.likeListByUserIdGet = likeListByUserIdGet;
const likePost = async (req, res, next) => {
    try {
        const result = await (0, likeModel_1.postLike)(Number(req.body.media_id), res.locals.user.user_id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.likePost = likePost;
const likeDelete = async (req, res, next) => {
    try {
        const result = await (0, likeModel_1.deleteLike)(Number(req.params.id), res.locals.user.user_id, res.locals.user.level_name);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.likeDelete = likeDelete;
// Fetch likes count by media id
const likeCountByMediaIdGet = async (req, res, next) => {
    try {
        const count = await (0, likeModel_1.fetchLikesCountByMediaId)(Number(req.params.id));
        res.json({ count });
    }
    catch (error) {
        next(error);
    }
};
exports.likeCountByMediaIdGet = likeCountByMediaIdGet;
const likeByMediaIdAndUserIdGet = async (req, res, next) => {
    try {
        const result = await (0, likeModel_1.fetchLikeByMediaIdAndUserId)(Number(req.params.media_id), res.locals.user.user_id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.likeByMediaIdAndUserIdGet = likeByMediaIdAndUserIdGet;
//# sourceMappingURL=likeController.js.map