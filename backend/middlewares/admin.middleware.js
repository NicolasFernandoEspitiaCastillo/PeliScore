const CustomError = require('../utils/customError');

const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return next(new CustomError('Acceso denegado. Se requiere rol de administrador.', 403));
};

// --- PUNTO CLAVE: La exportación debe ser un objeto que contenga la función. ---
module.exports = {
    requireAdmin
};