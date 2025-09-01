const reviewModel = require('../models/review.model');
const contentModel = require('../models/content.model');
const CustomError = require('../utils/customError');
const { getClient } = require('../config/database');
const { ObjectId } = require('mongodb');

const createReview = async (req, res, next) => {
    const { contentId, title, comment, rating } = req.body;
    const userId = req.user._id;
    const client = getClient();
    const session = client.startSession();

    try {
        session.startTransaction();
        const hasReviewed = await reviewModel.findByUserAndContent(userId, contentId, { session });
        if (hasReviewed) {
            throw new CustomError('Ya has escrito una reseña para este contenido.', 409);
        }
        await reviewModel.create({ contentId, userId, title, comment, rating }, { session });
        const stats = await reviewModel.getStatsForContent(contentId, { session });
        await contentModel.updateRatingStats(contentId, stats.averageRating, stats.reviewCount, { session });
        await session.commitTransaction();
        res.status(201).json({ message: 'Reseña creada exitosamente.' });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};

const toggleLikeDislike = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { action } = req.body; // 'like' o 'dislike'
        const userId = req.user._id;
        if (!['like', 'dislike'].includes(action)) {
            return next(new CustomError('Acción no válida.', 400));
        }
        const review = await reviewModel.findById(reviewId);
        if (!review) {
            return next(new CustomError('Reseña no encontrada.', 404));
        }
        if (review.userId.equals(userId)) {
             return next(new CustomError('No puedes votar tu propia reseña.', 403));
        }
        const result = await reviewModel.toggleVote(reviewId, userId, action);
        res.json({ message: 'Voto registrado.', likes: result.likes, dislikes: result.dislikes });
    } catch (error) {
        next(error);
    }
};

// --- PUNTO CLAVE: Asegúrate de que este bloque exporte TODAS las funciones. ---
module.exports = {
    createReview,
    toggleLikeDislike,
};