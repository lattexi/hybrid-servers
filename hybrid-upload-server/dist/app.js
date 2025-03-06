"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const middlewares_1 = require("./middlewares");
const api_1 = __importDefault(require("./api"));
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: {
        directives: {
            connectSrc: ['*'],
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-eval'", '*'],
            styleSrc: ["'self'", "'unsafe-inline'", '*'],
            imgSrc: ['*'],
        },
    },
}));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
// serve public folder for apidoc
app.use(express_1.default.static('public'));
app.use('/api/v1', api_1.default);
app.use(middlewares_1.notFound);
app.use(middlewares_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map