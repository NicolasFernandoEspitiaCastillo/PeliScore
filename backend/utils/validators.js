const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');

/**
 * Middleware genérico para manejar validaciones de express-validator
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array().map((err) => ({
        field: err.param,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validación para IDs de MongoDB en parámetros de ruta
 */
const mongoIdParamValidation = [
  param('id')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID proporcionado no es válido'),
  handleValidationErrors,
];

/**
 * Validaciones para creación/edición de contenido
 */
const contentValidation = [
  body('title')
    .notEmpty().withMessage('El título es obligatorio')
    .isString().withMessage('El título debe ser un texto')
    .isLength({ min: 2, max: 200 }).withMessage('El título debe tener entre 2 y 200 caracteres'),

  body('type')
    .notEmpty().withMessage('El tipo es obligatorio (pelicula, serie o anime)')
    .isIn(['pelicula', 'serie', 'anime']).withMessage('El tipo debe ser "pelicula", "serie" o "anime"'),

  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser texto')
    .isLength({ max: 1000 }).withMessage('La descripción no debe superar los 1000 caracteres'),

  body('releaseYear')
    .optional()
    .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
    .withMessage(`El año debe estar entre 1900 y ${new Date().getFullYear() + 1}`),

  body('genres')
    .optional()
    .isArray().withMessage('Los géneros deben estar en un arreglo')
    .custom((arr) => arr.every((g) => typeof g === 'string'))
    .withMessage('Cada género debe ser un texto'),

  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 }).withMessage('El rating debe estar entre 0 y 10'),

  handleValidationErrors,
];

/**
 * Validaciones para categorías
 */
const categoryValidation = [
  body('name')
    .notEmpty().withMessage('El nombre de la categoría es obligatorio')
    .isString().withMessage('El nombre debe ser un texto')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre de la categoría debe tener entre 3 y 50 caracteres'),
  handleValidationErrors,
];

/**
 * Validaciones para reseñas
 */
const reviewValidation = [
  body('contentId')
    .notEmpty().withMessage('El ID del contenido es obligatorio')
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage('El ID del contenido no es válido'),

  body('title')
    .notEmpty().withMessage('El título de la reseña es obligatorio')
    .isString().withMessage('El título debe ser un texto'),

  body('comment')
    .optional()
    .isString().withMessage('El comentario debe ser un texto')
    .isLength({ max: 1000 }).withMessage('El comentario no debe superar los 1000 caracteres'),

  body('rating')
    .notEmpty().withMessage('La calificación es obligatoria')
    .isInt({ min: 1, max: 10 }).withMessage('La calificación debe estar entre 1 y 10'),

  handleValidationErrors,
];

/**
 * Validaciones para auth (registro/login)
 */
const authRegisterValidation = [
  body('username')
    .notEmpty().withMessage('El nombre de usuario es obligatorio')
    .isString().withMessage('El nombre de usuario debe ser texto')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre de usuario debe tener entre 3 y 50 caracteres'),

  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no es válido'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

  handleValidationErrors,
];

const authLoginValidation = [
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .isEmail().withMessage('El email no es válido'),

  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),

  handleValidationErrors,
];

module.exports = {
  mongoIdParamValidation,
  contentValidation,
  categoryValidation,
  reviewValidation,
  authRegisterValidation,
  authLoginValidation,
};
