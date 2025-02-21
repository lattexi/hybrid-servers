import mysql from 'mysql2/promise';

const promisePool = mysql.createPool({
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
        } catch (error) {
          console.error('Failed to parse JSON field:', {
            error: (error as Error).message,
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

export default promisePool;
