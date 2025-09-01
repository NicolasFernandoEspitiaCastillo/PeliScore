const passport = require('passport');
const CustomError = require('../utils/customError');

const requireAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            const message = info && info.message ? info.message : 'Acceso no autorizado.';
            return next(new CustomError(message, 401));
        }
        req.user = user;
        next();
    })(req, res, next);
};

// --- PUNTO CLAVE: La exportación debe ser un objeto que contenga la función. ---
module.exports = {
    requireAuth
};