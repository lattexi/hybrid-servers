"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaListMostLikedGet = exports.mediaByUserGet = exports.mediaDelete = exports.mediaPut = exports.mediaPost = exports.mediaGet = exports.mediaListGet = void 0;
const mediaModel_1 = require("../models/mediaModel");
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
const errorMessages_1 = require("../../utils/errorMessages");
const mediaListGet = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const media = await (0, mediaModel_1.fetchAllMedia)(Number(page), Number(limit));
        console.log(media);
        res.json(media);
    }
    catch (error) {
        next(error);
    }
};
exports.mediaListGet = mediaListGet;
const mediaGet = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const media = await (0, mediaModel_1.fetchMediaById)(id);
        res.json(media);
    }
    catch (error) {
        next(error);
    }
};
exports.mediaGet = mediaGet;
const mediaPost = async (req, res, next) => {
    try {
        // add user_id to media object from token
        req.body.user_id = res.locals.user.user_id;
        await (0, mediaModel_1.postMedia)(req.body);
        res.json({ message: 'Media created' });
    }
    catch (error) {
        next(error);
    }
};
exports.mediaPost = mediaPost;
const mediaDelete = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const result = await (0, mediaModel_1.deleteMedia)(id, res.locals.user.user_id, res.locals.token, res.locals.user.level_name);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.mediaDelete = mediaDelete;
const mediaPut = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await (0, mediaModel_1.putMedia)(req.body, id, res.locals.user.user_id, res.locals.user.level_name);
        res.json({ message: 'Media updated' });
    }
    catch (error) {
        next(error);
    }
};
exports.mediaPut = mediaPut;
const mediaByUserGet = async (req, res, next) => {
    try {
        const id = Number(req.params.id) || res.locals.user.user_id;
        if (isNaN(id)) {
            throw new CustomError_1.default(errorMessages_1.ERROR_MESSAGES.MEDIA.NO_ID, 400);
        }
        const media = await (0, mediaModel_1.fetchMediaByUserId)(id);
        res.json(media);
    }
    catch (error) {
        next(error);
    }
};
exports.mediaByUserGet = mediaByUserGet;
const mediaListMostLikedGet = async (req, res, next) => {
    try {
        const media = await (0, mediaModel_1.fetchMostLikedMedia)();
        res.json(media);
    }
    catch (error) {
        next(error);
    }
};
exports.mediaListMostLikedGet = mediaListMostLikedGet;
//# sourceMappingURL=mediaController.js.map