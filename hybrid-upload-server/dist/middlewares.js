"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUserToBody = exports.makeThumbnail = exports.authenticate = exports.errorHandler = exports.notFound = void 0;
const CustomError_1 = __importDefault(require("./classes/CustomError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getVideoThumbnail_1 = __importDefault(require("./utils/getVideoThumbnail"));
const sharp_1 = __importDefault(require("sharp"));
const notFound = (req, res, next) => {
    const error = new CustomError_1.default(`🔍 - Not Found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, req, res, next) => {
    console.error('errorHandler', err);
    res.status(err.status || 500);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};
exports.errorHandler = errorHandler;
const authenticate = async (req, res, next) => {
    console.log('authenticate');
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            next(new CustomError_1.default('Authentication failed 1', 401));
            return;
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log(decodedToken);
        if (!decodedToken) {
            next(new CustomError_1.default('Authentication failed 2', 401));
            return;
        }
        res.locals.user = decodedToken;
        next();
    }
    catch (error) {
        next(new CustomError_1.default('Authentication failed 3', 401));
    }
};
exports.authenticate = authenticate;
const makeThumbnail = async (req, res, next) => {
    try {
        if (!req.file) {
            next(new CustomError_1.default('File not uploaded', 500));
            return;
        }
        console.log('path', req.file.path);
        if (!req.file.mimetype.includes('video')) {
            sharp_1.default.cache(false);
            await (0, sharp_1.default)(req.file.path)
                .resize(320, 320)
                .png()
                .toFile(req.file.path + '-thumb.png')
                .catch((error) => {
                console.error('sharp error', error);
                next(new CustomError_1.default('Thumbnail not created by sharp', 500));
            });
            console.log('tn valmis');
            next();
            return;
        }
        await (0, getVideoThumbnail_1.default)(req.file.path);
        next();
    }
    catch (error) {
        next(new CustomError_1.default('Thumbnail not created', 500));
    }
};
exports.makeThumbnail = makeThumbnail;
// add user from res.locals to req.body to be accessed by multer
const addUserToBody = (req, res, next) => {
    // prevent injection
    if (!req.body.user) {
        delete req.body.user;
    }
    req.body.user = res.locals.user;
    next();
};
exports.addUserToBody = addUserToBody;
//# sourceMappingURL=middlewares.js.map