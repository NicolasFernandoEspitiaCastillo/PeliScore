const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');
const CustomError = require('../utils/customError');

// Registro de usuario
const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await userModel.findUserByEmail(email);
        if (existingUser) {
            return next(new CustomError('El correo electrónico ya está registrado.', 409));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await userModel.createUser({ username, email, password: hashedPassword });

        res.status(201).json({ message: 'Usuario registrado exitosamente.' });
    } catch (error) {
        next(error);
    }
};

// Login de usuario
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findUserByEmail(email);
        if (!user) {
            return next(new CustomError('Credenciales inválidas.', 401));
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return next(new CustomError('Credenciales inválidas.', 401));
        }

        const payload = { id: user._id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.json({
            message: 'Inicio de sesión exitoso.',
            token: `Bearer ${token}`,
        });
    } catch (error) {
        next(error);
    }
};

// Perfil de usuario autenticado
const getProfile = (req, res, next) => {
    if (!req.user) {
        return next(new CustomError('No se encontró el usuario del token.', 404));
    }
    res.json(req.user);
};

module.exports = {
    register,
    login,
    getProfile,
};
