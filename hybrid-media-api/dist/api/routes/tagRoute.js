"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const tagController_1 = require("../controllers/tagController");
const middlewares_1 = require("../../middlewares");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router
    .route('/')
    .get(tagController_1.tagListGet)
    .post(middlewares_1.authenticate, (0, express_validator_1.body)('tag_name')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 2, max: 50 })
    .escape(), (0, express_validator_1.body)('media_id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, tagController_1.tagPost);
router
    .route('/bymedia/:id')
    .get((0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, tagController_1.tagListByMediaIdGet);
router
    .route('/bymedia/:media_id/:tag_id')
    .delete(middlewares_1.authenticate, (0, express_validator_1.param)('media_id').isInt({ min: 1 }).toInt(), (0, express_validator_1.param)('tag_id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, tagController_1.tagDeleteFromMedia);
router
    .route('/bytag/:tag_id')
    .get((0, express_validator_1.param)('tag_id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, tagController_1.tagFilesByTagGet);
router
    .route('/:id')
    .delete(middlewares_1.authenticate, (0, express_validator_1.param)('id').isInt({ min: 1 }).toInt(), middlewares_1.validationErrors, tagController_1.tagDelete);
exports.default = router;
//# sourceMappingURL=tagRoute.js.map