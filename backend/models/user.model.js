// helper: no mongoose. We will just export the collection name and optionally indexes creation function.
const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

// Función auxiliar para obtener la colección de usuarios.
const getCollection = () => getDB().collection('users');

/**
 * Crea un nuevo usuario en la base de datos.
 * @param {object} userData - Datos del usuario { username, email, password }.
 * @returns {Promise<ObjectId>} El ID del usuario insertado.
 */
const createUser = async ({ username, email, password }) => {
    const collection = getCollection();
    const result = await collection.insertOne({
        username,
        email: email.toLowerCase(), // Guardar email en minúsculas para consistencia.
        password, // La contraseña ya debe venir hasheada desde el controlador.
        role: 'user', // Asignar rol de 'user' por defecto.
        createdAt: new Date(),
    });
    return result.insertedId;
};

/**
 * Busca un usuario por su dirección de correo electrónico.
 * @param {string} email - El correo electrónico del usuario a buscar.
 * @returns {Promise<object|null>} El documento del usuario o null si no se encuentra.
 */
const findUserByEmail = async (email) => {
    const collection = getCollection();
    // Devuelve el documento completo, incluyendo la contraseña para la verificación en el login.
    return await collection.findOne({ email: email.toLowerCase() });
};

/**
 * Busca un usuario por su ID.
 * @param {string} id - El ID del usuario.
 * @returns {Promise<object|null>} El documento del usuario sin la contraseña.
 */
const findUserById = async (id) => {
    const collection = getCollection();
    // Usa una proyección para excluir el campo 'password' por seguridad.
    return await collection.findOne(
        { _id: new ObjectId(id) },
        { projection: { password: 0 } }
    );
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
};
