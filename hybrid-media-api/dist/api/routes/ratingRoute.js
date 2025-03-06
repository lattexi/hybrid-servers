"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ratingController_1 = require("../controllers/ratingController");
const middlewares_1 = require("../../middlewares");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router
    .route('/')
    .get(ratingController_1.ratingListGet)
    .post(middlewares_1.authenticate, (0, express_validator_1.body)('rating_value').notEmpty().isInt({ min: 1, max: 5 }).toInt(), (0, express_validator_1.body)('media_id').notEmpty().isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, ratingController_1.ratingPost);
router
    .route('/bymedia/:id')
    .get((0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, ratingController_1.ratingListByMediaIdGet);
router.route('/byuser').get(middlewares_1.authenticate, ratingController_1.ratingListByUserGet);
router
    .route('/average/:id')
    .get((0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, ratingController_1.ratingAverageByMediaIdGet);
router
    .route('/:id')
    .delete(middlewares_1.authenticate, (0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, ratingController_1.ratingDelete);
exports.default = router;
//# sourceMappingURL=ratingRoute.js.map