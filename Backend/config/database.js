// Importamos el paquete mysql2 con soporte para promesas
const mysql = require('mysql2/promise');

/* ---------------------------------------------------
   🔹 Configuración de la conexión con la base de datos
   ---------------------------------------------------
   Usamos un pool de conexiones para que el servidor 
   no tenga que abrir y cerrar conexiones todo el tiempo.
   Esto mejora el rendimiento y evita saturar MySQL.
*/
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',   
    password: '155188306', 
    database: 'hospitaldb', // Nombre exacto de tu base de datos
    waitForConnections: true, 
    connectionLimit: 10, // Máximo de conexiones simultáneas
    queueLimit: 0       // 0 = sin límite de espera
});

/* ---------------------------------------------------
   🔹 Función para ejecutar consultas SQL
   ---------------------------------------------------
   Permite ejecutar cualquier consulta (SELECT, INSERT,
   UPDATE, DELETE, etc.) de forma segura y reutilizable.
   Se pueden pasar parámetros para evitar inyecciones SQL.
*/
const execute = async (sql, params = []) => {
    try {
        const [rows] = await pool.execute(sql, params);
        return rows;
    } catch (error) {
        console.error('❌ Error al ejecutar la consulta SQL:', error.message);
        throw error;
    }
};

/* ---------------------------------------------------
   🔹 Verificación inicial del pool
   ---------------------------------------------------
   Esto solo comprueba que la conexión se pueda realizar.
   No es obligatorio, pero sirve como prueba de arranque.
*/
pool.getConnection()
    .then(connection => {
        console.log('✅ Conexión con hospitaldb verificada correctamente.');
        connection.release(); // Liberamos la conexión enseguida
    })
    .catch(err => {
        console.error('⚠️ Error al conectar con la base de datos:', err.message);
    });

// Exportamos el pool y la función para usar en otros módulos
module.exports = {
    pool,
    execute
};
