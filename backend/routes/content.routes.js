const express = require('express');
const router = express.Router();
const contentController = require('../controllers/content.controller');
const { contentValidation, mongoIdParamValidation } = require('../utils/validators');
const { requireAuth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Content
 *   description: Endpoints para gestión de películas, series y animes
 */

// Crear contenido
router.post('/', requireAuth, contentValidation, contentController.createContent);

// Listar todo el contenido
router.get('/', contentController.getAllContent);

// Obtener contenido por ID
router.get('/:id', mongoIdParamValidation, contentController.getContentById);

// Actualizar contenido
router.put('/:id', requireAuth, contentValidation, contentController.updateContent);

// Eliminar contenido
router.delete('/:id', requireAuth, contentController.deleteContent);

module.exports = router;
