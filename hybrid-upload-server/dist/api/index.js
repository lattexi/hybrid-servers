"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileRoute_1 = __importDefault(require("./routes/fileRoute"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({
        message: 'routes: /upload, /delete',
    });
});
router.use('/', fileRoute_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map