const mysql = require("mysql2/promise");

// Configuración de base de datos
const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "155188306",
  database: "hospitaldb",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

const pool = mysql.createPool(dbConfig);

// Ejecuta consultas SQL parametrizadas para evitar SQL injection
const execute = async (sql, params = []) => {
  try {
    const [result] = await pool.execute(sql, params);
    // Para SELECT: result es un array de registros
    // Para INSERT/UPDATE/DELETE: result es un objeto con insertId, affectedRows, etc.
    // Ambos se retornan tal cual - el caller debe saber qué espera
    return result;
  } catch (error) {
    console.error("Error executing SQL:", error.message);
    throw error;
  }
};

// Verifica la conexión a la base de datos
pool
  .getConnection()
  .then((c) => c.release())
  .catch((err) => console.error("DB connection error:", err.message));

// Exporta la configuración y utilidades
module.exports = {
  pool,
  execute,
  // JWT Secret fallback (ya que no usamos .env)
  JWT_SECRET: process.env.JWT_SECRET || "narutoUzumaki12345",
};
