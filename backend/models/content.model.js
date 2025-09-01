const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

const getCollection = () => getDB().collection('content');

/**
 * Crea una nueva entrada de contenido.
 * @param {object} contentData - Datos del contenido.
 * @returns {Promise<ObjectId>} El ID del contenido insertado.
 */
const create = async ({ title, description, categoryId, year, imageUrl, userId }) => {
    const result = await getCollection().insertOne({
        title,
        description,
        categoryId: new ObjectId(categoryId),
        year: parseInt(year, 10),
        imageUrl: imageUrl || null,
        status: 'pending', // El contenido nuevo siempre requiere aprobación.
        submittedBy: new ObjectId(userId),
        averageRating: 0,
        reviewCount: 0,
        createdAt: new Date(),
    });
    return result.insertedId;
};

/**
 * Busca contenido por su título (insensible a mayúsculas/minúsculas).
 * @param {string} title - El título a buscar.
 * @returns {Promise<object|null>}
 */
const findByTitle = async (title) => {
    return await getCollection().findOne({ title: { $regex: `^${title}$`, $options: 'i' } });
};

/**
 * Busca todo el contenido aplicando filtros. Usa agregación para incluir el nombre de la categoría.
 * @param {object} filters - Objeto con los filtros a aplicar (ej. { status, categoryId }).
 * @returns {Promise<Array>}
 */
const findAll = async (filters = {}) => {
    const pipeline = [
        // Une ('join') con la colección de categorías.
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'categoryInfo',
            },
        },
        // Desenrolla el array resultante del lookup.
        { $unwind: '$categoryInfo' },
        // Proyecta los campos deseados para darles un formato limpio.
        {
            $project: {
                title: 1,
                year: 1,
                imageUrl: 1,
                status: 1,
                averageRating: 1,
                reviewCount: 1,
                category: '$categoryInfo.name', // Renombra el campo.
            },
        },
    ];
    // Añade la etapa de filtro si se proporcionan filtros.
    if (Object.keys(filters).length > 0) {
        pipeline.unshift({ $match: filters });
    }
    return await getCollection().aggregate(pipeline).toArray();
};

/**
 * Busca un contenido por ID y adjunta detalles de categoría y reseñas.
 * @param {string} id - El ID del contenido.
 * @returns {Promise<object|null>}
 */
const findByIdWithDetails = async (id) => {
    const pipeline = [
        { $match: { _id: new ObjectId(id) } },
        {
            $lookup: {
                from: 'categories',
                localField: 'categoryId',
                foreignField: '_id',
                as: 'categoryInfo',
            },
        },
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'contentId',
                as: 'reviews',
            },
        },
        { $unwind: '$categoryInfo' },
        {
            $project: {
                // Proyectar todos los campos necesarios.
                title: 1, description: 1, year: 1, imageUrl: 1,
                status: 1, averageRating: 1, reviewCount: 1,
                category: '$categoryInfo.name',
                reviews: 1, // Incluir el array completo de reseñas.
            },
        },
    ];
    const results = await getCollection().aggregate(pipeline).toArray();
    return results[0] || null;
};

/**
 * Actualiza el estado de un contenido (ej. 'pending' a 'approved').
 * @param {string} id - El ID del contenido.
 * @param {string} status - El nuevo estado.
 * @returns {Promise<boolean>}
 */
const updateStatusById = async (id, status) => {
    const result = await getCollection().updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
    );
    return result.matchedCount > 0;
};

/**
 * Actualiza las estadísticas de calificación de un contenido.
 * @param {string} contentId - El ID del contenido.
 * @param {number} averageRating - El nuevo rating promedio.
 * @param {number} reviewCount - El nuevo conteo de reseñas.
 * @param {object} options - Opciones adicionales (ej. { session } para transacciones).
 * @returns {Promise<void>}
 */
const updateRatingStats = async (contentId, averageRating, reviewCount, options = {}) => {
    await getCollection().updateOne(
        { _id: new ObjectId(contentId) },
        { $set: { averageRating, reviewCount } },
        options
    );
};

const deleteById = async (id) => {
    const result = await getCollection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
};

module.exports = {
    create,
    findByTitle,
    findAll,
    findByIdWithDetails,
    updateStatusById,
    updateRatingStats,
    deleteById,
};