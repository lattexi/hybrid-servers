"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const middlewares_1 = require("../../middlewares");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router
    .route('/')
    .get(commentController_1.commentListGet)
    .post(middlewares_1.authenticate, (0, express_validator_1.body)('comment_text')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1 })
    .escape(), (0, express_validator_1.body)('media_id').notEmpty().isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, commentController_1.commentPost);
router
    .route('/bymedia/:id')
    .get((0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, commentController_1.commentListByMediaIdGet);
router.route('/byuser').get(middlewares_1.authenticate, commentController_1.commentListByUserGet);
router
    .route('/count/:id')
    .get((0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, commentController_1.commentCountByMediaIdGet);
router
    .route('/:id')
    .get((0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, commentController_1.commentGet)
    .put(middlewares_1.authenticate, (0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), (0, express_validator_1.body)('comment_text')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 1 })
    .escape(), middlewares_1.validationErrors, commentController_1.commentPut)
    .delete(middlewares_1.authenticate, (0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, commentController_1.commentDelete);
exports.default = router;
//# sourceMappingURL=commentRoute.js.map