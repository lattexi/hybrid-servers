"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uploadController_1 = require("../controllers/uploadController");
const multer_1 = __importDefault(require("multer"));
const middlewares_1 = require("../../middlewares");
const CustomError_1 = __importDefault(require("../../classes/CustomError"));
const randomstring_1 = __importDefault(require("randomstring"));
const storage = multer_1.default.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        const userId = req.res?.locals.user.user_id;
        const extension = file.originalname.split('.').pop();
        // generate random filename
        const randomName = randomstring_1.default.generate(20);
        const newFilename = `${randomName}_${userId}.${extension}`;
        cb(null, newFilename);
    },
});
const upload = (0, multer_1.default)({ storage }).single('file');
const doUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            next(new CustomError_1.default(err.message, 400));
            return;
        }
        if (req.file &&
            (req.file.mimetype.includes('image') ||
                req.file.mimetype.includes('video'))) {
            next();
        }
    });
};
const router = express_1.default.Router();
router.route('/upload').post(middlewares_1.authenticate, doUpload, middlewares_1.makeThumbnail, uploadController_1.uploadFile);
router.route('/delete/:filename').delete(middlewares_1.authenticate, uploadController_1.deleteFile);
exports.default = router;
//# sourceMappingURL=fileRoute.js.map