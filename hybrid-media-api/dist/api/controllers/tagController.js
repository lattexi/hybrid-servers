"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagDeleteFromMedia = exports.tagFilesByTagGet = exports.tagDelete = exports.tagPost = exports.tagListByMediaIdGet = exports.tagListGet = void 0;
const tagModel_1 = require("../models/tagModel");
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
const tagListGet = async (req, res, next) => {
    try {
        const tags = await (0, tagModel_1.fetchAllTags)();
        res.json(tags);
    }
    catch (error) {
        next(error);
    }
};
exports.tagListGet = tagListGet;
const tagListByMediaIdGet = async (req, res, next) => {
    try {
        const tags = await (0, tagModel_1.fetchTagsByMediaId)(Number(req.params.id));
        res.json(tags);
    }
    catch (error) {
        next(error);
    }
};
exports.tagListByMediaIdGet = tagListByMediaIdGet;
const tagPost = async (req, res, next) => {
    try {
        const result = await (0, tagModel_1.postTag)(req.body.tag_name, Number(req.body.media_id));
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.tagPost = tagPost;
const tagFilesByTagGet = async (req, res, next) => {
    try {
        const files = await (0, tagModel_1.fetchFilesByTagById)(Number(req.params.tag_id));
        res.json(files);
    }
    catch (error) {
        next(error);
    }
};
exports.tagFilesByTagGet = tagFilesByTagGet;
const tagDelete = async (req, res, next) => {
    try {
        if (res.locals.user.level_name !== 'Admin') {
            throw new CustomError_1.default('Not authorized', 401);
        }
        const result = await (0, tagModel_1.deleteTag)(Number(req.params.id));
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.tagDelete = tagDelete;
const tagDeleteFromMedia = async (req, res, next) => {
    try {
        const result = await (0, tagModel_1.deleteTagFromMedia)(Number(req.params.tag_id), Number(req.params.media_id), res.locals.user.user_id);
        res.json(result);
    }
    catch (error) {
        next(error);
    }
};
exports.tagDeleteFromMedia = tagDeleteFromMedia;
//# sourceMappingURL=tagController.js.map