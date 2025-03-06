"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.fetchData = void 0;
const CustomError_1 = __importDefault(require("../classes/CustomError"));
const fetchData = async (url, options = {}) => {
    console.log('fetching data');
    const response = await fetch(url, options);
    const json = await response.json();
    if (!response.ok) {
        const errorJson = json;
        console.log('errorJson', errorJson);
        if (errorJson.message) {
            throw new Error(errorJson.message);
        }
        throw new Error(`Error ${response.status} occured`);
    }
    return json;
};
exports.fetchData = fetchData;
const handleError = (message, status, next) => {
    next(new CustomError_1.default(message, status));
};
exports.handleError = handleError;
//# sourceMappingURL=functions.js.map