const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/review.controller');
const { reviewValidation, mongoIdParamValidation } = require('../utils/validators');
const { requireAuth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Endpoints para reseñas de usuarios
 */

// Crear reseña
router.post('/', requireAuth, reviewValidation, reviewController.createReview);

// Listar reseñas de un contenido
router.get('/content/:id', mongoIdParamValidation, reviewController.getReviewsByContent);

// Obtener reseña por ID
router.get('/:id', mongoIdParamValidation, reviewController.getReviewById);

// Actualizar reseña
router.put('/:id', requireAuth, reviewValidation, reviewController.updateReview);

// Eliminar reseña
router.delete('/:id', requireAuth, reviewController.deleteReview);

module.exports = router;
