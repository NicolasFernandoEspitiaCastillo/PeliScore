const contentModel = require('../models/content.model');
const CustomError = require('../utils/customError');
const { ObjectId } = require('mongodb');

const createContent = async (req, res, next) => {
    try {
        const { title, description, categoryId, year, imageUrl } = req.body;
        const userId = req.user._id;
        const existingContent = await contentModel.findByTitle(title);
        if (existingContent) {
            return next(new CustomError('Ya existe un contenido con este título.', 409));
        }
        const contentId = await contentModel.create({ title, description, categoryId, year, imageUrl, userId });
        res.status(201).json({ message: 'Contenido enviado para aprobación.', contentId });
    } catch (error) {
        next(error);
    }
};

const getAllContent = async (req, res, next) => {
    try {
        const filters = { status: 'approved' };
        if (req.user && req.user.role === 'admin' && req.query.status) {
            filters.status = req.query.status;
        }
        if (req.query.categoryId) {
            filters.categoryId = req.query.categoryId;
        }
        const content = await contentModel.findAll(filters);
        res.json(content);
    } catch (error) {
        next(error);
    }
};

const getContentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return next(new CustomError('ID de contenido no válido.', 400));
        }
        const content = await contentModel.findByIdWithDetails(id);
        if (!content || (content.status !== 'approved' && (!req.user || req.user.role !== 'admin'))) {
            return next(new CustomError('Contenido no encontrado.', 404));
        }
        res.json(content);
    } catch (error) {
        next(error);
    }
};

const approveContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return next(new CustomError('ID de contenido no válido.', 400));
        }
        const success = await contentModel.updateStatusById(id, 'approved');
        if (!success) {
            return next(new CustomError('Contenido no encontrado o ya aprobado.', 404));
        }
        res.json({ message: 'Contenido aprobado exitosamente.' });
    } catch (error) {
        next(error);
    }
};

const deleteContent = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return next(new CustomError('ID de contenido no válido.', 400));
        }
        const success = await contentModel.deleteById(id);
        if (!success) {
            return next(new CustomError('Contenido no encontrado.', 404));
        }
        res.json({ message: 'Contenido eliminado exitosamente.' });
    } catch (error) {
        next(error);
    }
};

// --- PUNTO CLAVE: Asegúrate de que este bloque exporte TODAS las funciones. ---
module.exports = {
    createContent,
    getAllContent,
    getContentById,
    approveContent,
    deleteContent,
};