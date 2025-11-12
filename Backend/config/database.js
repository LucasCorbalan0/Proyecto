const mysql = require('mysql2/promise');


const dbConfig = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '155188306',
    database: 'hospitaldb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

//una consulta parametrizada para ahorrar repetir codigo en los controller
const execute = async (sql, params = []) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('Error executing SQL:', error.message);
        throw error;
    }
};


pool.getConnection().then(c => c.release()).catch(err => console.error('DB connection error:', err.message));

module.exports = { pool, execute };
