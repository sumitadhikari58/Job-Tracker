const mysql = require('mysql2/promise')
const dotenv = require('dotenv')
dotenv.config()
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    // Return DATE columns as 'YYYY-MM-DD' strings instead of JS Dates,
    // so date_applied isn't shifted by the server's timezone
    dateStrings: ['DATE'],
})
module.exports = pool
