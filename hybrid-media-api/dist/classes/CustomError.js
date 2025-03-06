"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    status = 400;
    constructor(message, status) {
        super(message);
        this.status = status;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.default = CustomError;
//# sourceMappingURL=CustomError.js.map