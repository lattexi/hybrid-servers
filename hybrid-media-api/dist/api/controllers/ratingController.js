"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingAverageByMediaIdGet = exports.ratingDelete = exports.ratingPost = exports.ratingListByUserGet = exports.ratingListByMediaIdGet = exports.ratingListGet = void 0;
const ratingModel_1 = require("../models/ratingModel");
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
// list of ratings
const ratingListGet = async (req, res, next) => {
    try {
        const ratings = await (0, ratingModel_1.fetchAllRatings)();
        res.json(ratings);
    }
    catch (error) {
        next(error);
    }
};
exports.ratingListGet = ratingListGet;
// list of ratings by media item id
const ratingListByMediaIdGet = async (req, res, next) => {
    try {
        const ratings = await (0, ratingModel_1.fetchRatingsByMediaId)(Number(req.params.id));
        res.json(ratings);
    }
    catch (error) {
        next(error);
    }
};
exports.ratingListByMediaIdGet = ratingListByMediaIdGet;
// list of ratings by user id
const ratingListByUserGet = async (req, res, next) => {
    try {
        const ratings = await (0, ratingModel_1.fetchRatingsByUserId)(Number(res.locals.user.user_id));
        if (ratings) {
            res.json(ratings);
            return;
        }
        next(new CustomError_1.default('No ratings found', 404));
    }
    catch (error) {
        next(error);
    }
};
exports.ratingListByUserGet = ratingListByUserGet;
// Post a new rating
const ratingPost = async (req, res, next) => {
    try {
        const result = await (0, ratingModel_1.postRating)(Number(req.body.rating_value), res.locals.user.user_id, Number(req.body.media_id));
        if (result) {
            res.json(result);
            return;
        }
        next(new CustomError_1.default('Rating not created', 500));
    }
    catch (error) {
        next(error);
    }
};
exports.ratingPost = ratingPost;
// Delete a rating
const ratingDelete = async (req, res, next) => {
    try {
        const result = await (0, ratingModel_1.deleteRating)(Number(req.params.id), res.locals.user.user_id, res.locals.user.level_name);
        if (result) {
            res.json(result);
            return;
        }
        next(new CustomError_1.default('Rating not deleted', 500));
    }
    catch (error) {
        next(error);
    }
};
exports.ratingDelete = ratingDelete;
const ratingAverageByMediaIdGet = async (req, res, next) => {
    try {
        const average = await (0, ratingModel_1.fetchAverageRatingByMediaId)(Number(req.params.id));
        if (average) {
            res.json({ average });
            return;
        }
        next(new CustomError_1.default('No ratings found', 404));
    }
    catch (error) {
        next(error);
    }
};
exports.ratingAverageByMediaIdGet = ratingAverageByMediaIdGet;
//# sourceMappingURL=ratingController.js.map