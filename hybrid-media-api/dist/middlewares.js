"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrors = exports.authenticate = exports.errorHandler = exports.notFound = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const CustomError_1 = __importDefault(require("./classes/CustomError"));
const notFound = (req, res, next) => {
    const error = new CustomError_1.default(`🔍 - Not Found - ${req.originalUrl}`, 404);
    next(error);
};
exports.notFound = notFound;
const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    // console.log(err);
    const statusCode = err.status !== 200 ? err.status || 500 : 500;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};
exports.errorHandler = errorHandler;
const authenticate = async (req, res, next) => {
    try {
        const bearer = req.headers.authorization;
        if (!bearer) {
            next(new CustomError_1.default('No token provided', 401));
            return;
        }
        const token = bearer.split(' ')[1];
        if (!token) {
            next(new CustomError_1.default('No token provided', 401));
            return;
        }
        const userFromToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('userFromToken', userFromToken);
        if (!userFromToken) {
            next(new CustomError_1.default('Token not valid', 403));
            return;
        }
        res.locals.user = userFromToken;
        // token added for deleting media
        res.locals.token = token;
        next();
    }
    catch (error) {
        next(new CustomError_1.default(error.message, 400));
    }
};
exports.authenticate = authenticate;
const validationErrors = (req, _res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const messages = errors
            .array({ onlyFirstError: true })
            .map((error) => `${error.msg}: ${error.path}`)
            .join(', ');
        next(new CustomError_1.default(messages, 400));
        return;
    }
    next();
};
exports.validationErrors = validationErrors;
//# sourceMappingURL=middlewares.js.map