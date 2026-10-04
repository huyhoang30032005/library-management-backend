const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.MYSQLHOST || "localhost",
    port: process.env.MYSQLPORT || 3306,
    user: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "30032005",
    database: process.env.MYSQLDATABASE || "library_management",

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;