import { body } from "express-validator";

export const movieCreateValidator = [
  body("titulo").isString().notEmpty().withMessage("titulo requerido"),
  body("descripcion").optional().isString(),
  body("categoriaId").isString().withMessage("categoriaId requerido"),
  body("anio")
    .optional()
    .isInt({ min: 1800, max: 2100 })
    .withMessage("anio inválido"),
];
