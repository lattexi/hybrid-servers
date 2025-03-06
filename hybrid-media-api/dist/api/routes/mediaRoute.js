"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaController_1 = require("../controllers/mediaController");
const middlewares_1 = require("../../middlewares");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router
    .route('/')
    .get((0, express_validator_1.query)('page').optional().isInt({ min: 1 }).toInt(), (0, express_validator_1.query)('limit').optional().isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, mediaController_1.mediaListGet)
    .post(middlewares_1.authenticate, (0, express_validator_1.body)('title')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 3, max: 128 })
    .escape(), (0, express_validator_1.body)('description')
    .optional()
    .trim()
    .isString()
    .isLength({ max: 2000 })
    .escape(), (0, express_validator_1.body)('filename')
    .trim()
    .notEmpty()
    .isString()
    .matches(/^[\w.-]+$/)
    .escape(), (0, express_validator_1.body)('media_type').trim().notEmpty().isMimeType(), (0, express_validator_1.body)('filesize').notEmpty().isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, mediaController_1.mediaPost);
router.route('/mostliked').get(mediaController_1.mediaListMostLikedGet);
router
    .route('/:id')
    .get((0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, mediaController_1.mediaGet)
    .put(middlewares_1.authenticate, (0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), (0, express_validator_1.body)('title')
    .optional()
    .trim()
    .isString()
    .isLength({ min: 3, max: 128 })
    .escape(), (0, express_validator_1.body)('description')
    .optional()
    .trim()
    .isString()
    .isLength({ max: 2000 })
    .escape(), middlewares_1.validationErrors, mediaController_1.mediaPut)
    .delete(middlewares_1.authenticate, (0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, mediaController_1.mediaDelete);
router.route('/byuser/:id').get(mediaController_1.mediaByUserGet);
router.route('/bytoken').get(middlewares_1.authenticate, mediaController_1.mediaByUserGet);
exports.default = router;
//# sourceMappingURL=mediaRoute.js.map