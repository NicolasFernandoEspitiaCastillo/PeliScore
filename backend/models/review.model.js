const { getDB } = require('../config/database');
const { ObjectId } = require('mongodb');

const getCollection = () => getDB().collection('reviews');

/**
 * Crea una nueva reseña.
 * @param {object} reviewData - Datos de la reseña.
 * @param {object} options - Opciones adicionales (ej. { session } para transacciones).
 * @returns {Promise<ObjectId>}
 */
const create = async ({ contentId, userId, title, comment, rating }, options = {}) => {
    const result = await getCollection().insertOne({
        contentId: new ObjectId(contentId),
        userId: new ObjectId(userId),
        title,
        comment,
        rating: Number(rating),
        likes: [],      // Array de IDs de usuarios que dieron like.
        dislikes: [],   // Array de IDs de usuarios que dieron dislike.
        createdAt: new Date(),
    }, options);
    return result.insertedId;
};

/**
 * Busca si un usuario ya ha creado una reseña para un contenido específico.
 * @param {string} userId - ID del usuario.
 * @param {string} contentId - ID del contenido.
 * @param {object} options - Opciones adicionales (ej. { session }).
 * @returns {Promise<object|null>}
 */
const findByUserAndContent = async (userId, contentId, options = {}) => {
    return await getCollection().findOne({
        userId: new ObjectId(userId),
        contentId: new ObjectId(contentId)
    }, options);
};

/**
 * Calcula las estadísticas de calificación para un contenido.
 * @param {string} contentId - ID del contenido.
 * @param {object} options - Opciones adicionales (ej. { session }).
 * @returns {Promise<{ averageRating: number, reviewCount: number }>}
 */
const getStatsForContent = async (contentId, options = {}) => {
    const pipeline = [
        { $match: { contentId: new ObjectId(contentId) } },
        {
            $group: {
                _id: '$contentId',
                averageRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 },
            },
        },
    ];
    const results = await getCollection().aggregate(pipeline, options).toArray();
    if (results.length > 0) {
        // Redondear el promedio a 1 decimal.
        results[0].averageRating = Math.round(results[0].averageRating * 10) / 10;
        return results[0];
    }
    return { averageRating: 0, reviewCount: 0 };
};

const findById = async (id) => {
    return await getCollection().findOne({ _id: new ObjectId(id) });
};

/**
 * Añade o quita un voto (like/dislike) de un usuario en una reseña.
 * @param {string} reviewId - ID de la reseña.
 * @param {string} userId - ID del usuario que vota.
 * @param {string} action - 'like' o 'dislike'.
 * @returns {Promise<object>} Las nuevas cuentas de likes y dislikes.
 */
const toggleVote = async (reviewId, userId, action) => {
    const userObjectId = new ObjectId(userId);
    const update = action === 'like'
        ? { $addToSet: { likes: userObjectId }, $pull: { dislikes: userObjectId } }
        : { $addToSet: { dislikes: userObjectId }, $pull: { likes: userObjectId } };

    const result = await getCollection().findOneAndUpdate(
        { _id: new ObjectId(reviewId) },
        update,
        { returnDocument: 'after', projection: { likes: 1, dislikes: 1 } }
    );
    
    // Devuelve el número de likes/dislikes
    return {
        likes: result.likes.length,
        dislikes: result.dislikes.length,
    };
};

module.exports = {
    create,
    findByUserAndContent,
    getStatsForContent,
    findById,
    toggleVote,
};
