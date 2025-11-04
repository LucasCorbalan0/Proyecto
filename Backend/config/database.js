// En tu archivo de configuración de base de datos (Ej: database.js)

// 🔑 CAMBIO CLAVE: Importar la versión de promesas
import mysql from 'mysql2/promise'; 

// 🎯 OPCIÓN 1: Usar un Connection Pool (Mejor práctica para servidores)
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '155188306',
    database: 'hospitaldb',
    waitForConnections: true, // Espera si no hay conexiones disponibles
    connectionLimit: 10,       // Límite de conexiones simultáneas
    queueLimit: 0              // Cola de espera ilimitada
});

// Función para verificar la conexión al iniciar el servidor (Similar a connect())
async function checkDbConnection() {
    try {
        // Obtenemos una conexión del pool para probarla
        const connection = await pool.getConnection();
        console.log('✅ Connected successfully to the MySQL database (hospitaldb).');
        connection.release(); // Devolvemos la conexión al pool
    } catch (err) {
        console.error('❌ Error connecting to the database:', err.message);
        // Opcional: Terminar el proceso si la conexión falla al inicio
        // process.exit(1); 
    }
}

// Ejecutamos la verificación al iniciar (similar a connection.connect())
checkDbConnection(); 

// 🔑 Exportar el Pool. Ahora tus controladores pueden usar pool.query() o pool.getConnection()
export default pool;