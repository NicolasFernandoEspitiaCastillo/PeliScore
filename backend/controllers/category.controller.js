const categoryModel = require('../models/category.model');
const CustomError = require('../utils/customError');
const { ObjectId } = require('mongodb');

const createCategory = async (req, res, next) => {
    try {
        const { name } = req.body;
        const existingCategory = await categoryModel.findByName(name);
        if (existingCategory) {
            return next(new CustomError('Ya existe una categoría con ese nombre.', 409));
        }
        const categoryId = await categoryModel.create({ name });
        res.status(201).json({ message: 'Categoría creada exitosamente.', categoryId });
    } catch (error) {
        next(error);
    }
};

const getAllCategories = async (req, res, next) => {
    try {
        const categories = await categoryModel.findAll();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!ObjectId.isValid(id)) {
            return next(new CustomError('El ID de la categoría no es válido.', 400));
        }
        const success = await categoryModel.updateById(id, { name });
        if (!success) {
            return next(new CustomError('Categoría no encontrada.', 404));
        }
        res.json({ message: 'Categoría actualizada exitosamente.' });
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return next(new CustomError('El ID de la categoría no es válido.', 400));
        }
        const success = await categoryModel.deleteById(id);
        if (!success) {
            return next(new CustomError('Categoría no encontrada.', 404));
        }
        res.json({ message: 'Categoría eliminada exitosamente.' });
    } catch (error) {
        next(error);
    }
};

// --- PUNTO CLAVE: Asegúrate de que este bloque exporte TODAS las funciones. ---
module.exports = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
};