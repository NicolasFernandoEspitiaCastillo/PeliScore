const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middlewares/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación de usuarios
 */

// Registro
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Perfil (requiere autenticación)
router.get('/profile', requireAuth, authController.getProfile);

module.exports = router;
