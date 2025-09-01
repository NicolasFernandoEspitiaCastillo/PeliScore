const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { categoryValidation, mongoIdParamValidation } = require('../utils/validators');
const { requireAuth, requireAdmin } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Endpoints para gestión de categorías
 */

// Crear categoría (solo admin)
router.post('/', requireAuth, requireAdmin, categoryValidation, categoryController.createCategory);

// Listar todas las categorías
router.get('/', categoryController.getAllCategories);

// Obtener categoría por ID
router.get('/:id', mongoIdParamValidation, categoryController.getCategoryById);

// Actualizar categoría (solo admin)
router.put('/:id', requireAuth, requireAdmin, categoryValidation, categoryController.updateCategory);

// Eliminar categoría (solo admin)
router.delete('/:id', requireAuth, requireAdmin, categoryController.deleteCategory);

module.exports = router;
