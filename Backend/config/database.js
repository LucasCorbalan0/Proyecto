const mysql = require('mysql2/promise');

// Función para ejecutar consultas
const execute = async (sql, params) => {
    try {
        return await pool.execute(sql, params);
    } catch (error) {
        console.error('Error ejecutando consulta:', error);
        throw error;
    }
};

// Configuración de la conexión a MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'harakiri.02',
    database: 'hospitaldb', // <<-- Nombre de tu BD verificada
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Mensaje de prueba (opcional, el pool no se conecta hasta que se usa)
pool.getConnection()
    .then(connection => {
        console.log('✅ Pool de conexiones a hospitaldb creado y verificado. 👌');
        connection.release(); // Liberar la conexión inmediatamente
    })
    .catch(err => {
        console.error('❌ Error al crear el Pool de conexiones:', err.message);
    });

module.exports = {
    pool,
    execute
};