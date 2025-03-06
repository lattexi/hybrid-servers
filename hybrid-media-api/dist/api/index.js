"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mediaRoute_1 = __importDefault(require("./routes/mediaRoute"));
const tagRoute_1 = __importDefault(require("./routes/tagRoute"));
const likeRoute_1 = __importDefault(require("./routes/likeRoute"));
const commentRoute_1 = __importDefault(require("./routes/commentRoute"));
const ratingRoute_1 = __importDefault(require("./routes/ratingRoute"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({
        message: 'media api v1',
    });
});
router.use('/media', mediaRoute_1.default);
router.use('/tags', tagRoute_1.default);
router.use('/likes', likeRoute_1.default);
router.use('/comments', commentRoute_1.default);
router.use('/ratings', ratingRoute_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map