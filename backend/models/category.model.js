const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

const getCollection = () => getDB().collection('categories');

/**
 * Crea una nueva categoría.
 * @param {object} categoryData - Datos de la categoría { name }.
 * @returns {Promise<ObjectId>} El ID de la categoría insertada.
 */
const create = async ({ name }) => {
    const result = await getCollection().insertOne({ name, createdAt: new Date() });
    return result.insertedId;
};

/**
 * Devuelve todas las categorías de la base de datos.
 * @returns {Promise<Array>} Un array con todos los documentos de categorías.
 */
const findAll = async () => {
    return await getCollection().find({}).sort({ name: 1 }).toArray();
};

/**
 * Busca una categoría por su nombre (insensible a mayúsculas/minúsculas).
 * @param {string} name - El nombre de la categoría a buscar.
 * @returns {Promise<object|null>} El documento de la categoría o null.
 */
const findByName = async (name) => {
    // Expresión regular para una coincidencia exacta e insensible a mayúsculas.
    return await getCollection().findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
};

/**
 * Actualiza una categoría por su ID.
 * @param {string} id - El ID de la categoría a actualizar.
 * @param {object} categoryData - Los nuevos datos { name }.
 * @returns {Promise<boolean>} True si se actualizó, false si no se encontró.
 */
const updateById = async (id, { name }) => {
    const result = await getCollection().updateOne(
        { _id: new ObjectId(id) },
        { $set: { name } }
    );
    return result.matchedCount > 0;
};

/**
 * Elimina una categoría por su ID.
 * @param {string} id - El ID de la categoría a eliminar.
 * @returns {Promise<boolean>} True si se eliminó, false si no se encontró.
 */
const deleteById = async (id) => {
    const result = await getCollection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
};

module.exports = { create, findAll, findByName, updateById, deleteById };