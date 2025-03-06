"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const promisePool = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    // Convert JSON fields to objects
    typeCast: function (field, next) {
        console.log('TypeCast field:', {
            type: field.type,
            name: field.name,
            table: field.table,
        });
        // Check for both string 'JSON' and MySQL type code 245
        if (field.name === 'screenshots') {
            const fieldValue = field.string('utf-8');
            console.log('JSON field value:', fieldValue);
            if (fieldValue) {
                try {
                    return JSON.parse(fieldValue);
                }
                catch (error) {
                    console.error('Failed to parse JSON field:', {
                        error: error.message,
                        field: field.name,
                        table: field.table,
                        value: fieldValue,
                    });
                    return null;
                }
            }
            return next();
        }
        return next();
    },
});
exports.default = promisePool;
//# sourceMappingURL=db.js.map