const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '155188306',
    database: 'hospitaldb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const execute = async (sql, params = []) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('❌ Error al ejecutar la consulta SQL:', error.message);
        throw error;
    }
};

pool.getConnection()
    .then(connection => {
        console.log(`
✅ Conexión con hospitaldb establecida correctamente.
(●_●) 👁️  Sharingan activado
        `);
        connection.release();
    })
    .catch(err => {
        console.error(`
⚠️ Error al conectar con la base de datos:
${err.message}
(×_×)💀  Chakra inestable — conexión fallida
        `);
    });

module.exports = { pool, execute };
