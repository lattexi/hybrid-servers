"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.uploadFile = void 0;
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
const fs_1 = __importDefault(require("fs"));
const UPLOAD_DIR = './uploads';
const uploadFile = async (req, res, next) => {
    const tempFiles = [];
    try {
        if (!req.file) {
            throw new CustomError_1.default('file not valid', 400);
        }
        const extension = req.file.originalname.split('.').pop();
        if (!extension) {
            throw new CustomError_1.default('Invalid file extension', 400);
        }
        const response = {
            message: 'file uploaded',
            data: {
                filename: req.file.filename,
                media_type: req.file.mimetype,
                filesize: req.file.size,
            },
        };
        res.json(response);
    }
    catch (error) {
        cleanup(tempFiles);
        next(error instanceof CustomError_1.default
            ? error
            : new CustomError_1.default(error.message, 400));
    }
};
exports.uploadFile = uploadFile;
const deleteFile = async (req, res, next) => {
    try {
        const { filename } = req.params;
        if (!filename) {
            throw new CustomError_1.default('filename not valid', 400);
        }
        // Check ownership by extracting user_id from filename
        if (res.locals.user.level_name !== 'Admin') {
            const fileUserId = filename.split('_').pop()?.split('.')[0];
            if (!fileUserId || fileUserId !== res.locals.user.user_id.toString()) {
                throw new CustomError_1.default('user not authorized', 401);
            }
        }
        const filePath = `${UPLOAD_DIR}/${filename}`;
        const thumbPath = `${UPLOAD_DIR}/${filename}-thumb.png`;
        if (!fs_1.default.existsSync(filePath)) {
            throw new CustomError_1.default('file not found', 404);
        }
        try {
            if (fs_1.default.existsSync(thumbPath)) {
                fs_1.default.unlinkSync(thumbPath);
            }
            fs_1.default.unlinkSync(filePath);
        }
        catch {
            throw new CustomError_1.default('Error deleting files', 500);
        }
        res.json({ message: 'File deleted' });
    }
    catch (error) {
        next(error instanceof CustomError_1.default
            ? error
            : new CustomError_1.default(error.message, 400));
    }
};
exports.deleteFile = deleteFile;
// Helper function to clean up temporary files
const cleanup = (files) => {
    files.forEach((file) => {
        try {
            if (fs_1.default.existsSync(file)) {
                fs_1.default.unlinkSync(file);
            }
        }
        catch (error) {
            console.error(`Error cleaning up file ${file}:`, error);
        }
    });
};
//# sourceMappingURL=uploadController.js.map