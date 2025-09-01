/**
 * Middleware manejador de errores centralizado.
 * Captura todos los errores pasados a través de `next(error)`.
 * @param {Error} err - El objeto de error.
 * @param {Request} req - El objeto de la petición de Express.
 * @param {Response} res - El objeto de la respuesta de Express.
 * @param {NextFunction} next - La función para pasar al siguiente middleware.
 */
const errorHandler = (err, req, res, next) => {
    // Log del error en la consola para depuración (puedes reemplazarlo con un logger más avanzado).
    console.error(`[ERROR] ${new Date().toISOString()} - ${err.message}`);
    console.error(err.stack);

    // Si el error tiene un statusCode definido (como nuestros CustomError), lo usamos.
    // De lo contrario, es un error interno del servidor (500).
    const statusCode = err.statusCode || 500;

    const response = {
        message: err.message || 'Ha ocurrido un error interno en el servidor.',
    };

    // En entorno de desarrollo, añadimos el stack del error para facilitar la depuración.
    // En producción, nunca se debe exponer el stack.
    if (process.env.NODE_ENV === 'development') {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;