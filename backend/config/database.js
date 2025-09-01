const { MongoClient } = require('mongodb');

// Instancia del cliente de MongoDB. Se crea una sola vez.
const client = new MongoClient(process.env.MONGO_URI);
let db;

/**
 * Establece la conexión con la base de datos MongoDB.
 * Esta función debe llamarse una vez al iniciar el servidor.
 */
async function connectDB() {
    // Si ya existe una conexión, no hace nada.
    if (db) return;
    try {
        // Conecta el cliente al servidor.
        await client.connect();
        db = client.db(process.env.DB_NAME);
        console.log('✅ Conexión a MongoDB establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar con MongoDB:', error);
        // Si la conexión falla, termina el proceso de la aplicación.
        process.exit(1);
    }
}

/**
 * Devuelve la instancia de la base de datos para realizar operaciones.
 * @returns {Db} Instancia de la base de datos.
 */
const getDB = () => db;

/**
 * Devuelve la instancia del cliente de MongoDB.
 * Es necesario para gestionar sesiones y transacciones.
 * @returns {MongoClient} Instancia del cliente.
 */
const getClient = () => client;

module.exports = { connectDB, getDB, getClient };