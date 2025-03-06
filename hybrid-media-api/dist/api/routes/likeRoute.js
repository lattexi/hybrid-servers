"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const likeController_1 = require("../controllers/likeController");
const middlewares_1 = require("../../middlewares");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router
    .route('/')
    .get(likeController_1.likeListGet)
    .post(middlewares_1.authenticate, (0, express_validator_1.body)('media_id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, likeController_1.likePost);
router
    .route('/bymedia/:media_id')
    .get((0, express_validator_1.param)('media_id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, likeController_1.likeListByMediaIdGet);
router
    .route('/bymedia/user/:media_id')
    .get(middlewares_1.authenticate, (0, express_validator_1.param)('media_id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, likeController_1.likeByMediaIdAndUserIdGet);
router
    .route('/byuser/:id')
    .get(middlewares_1.authenticate, (0, express_validator_1.param)('id').optional().isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, likeController_1.likeListByUserIdGet);
router
    .route('/count/:id')
    .get((0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, likeController_1.likeCountByMediaIdGet);
router
    .route('/:id')
    .delete(middlewares_1.authenticate, (0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, likeController_1.likeDelete);
exports.default = router;
//# sourceMappingURL=likeRoute.js.map