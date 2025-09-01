const rateLimit = require('express-rate-limit');

/**
 * Configuración del middleware para limitar la tasa de peticiones a la API.
 * Lee la configuración desde las variables de entorno para mayor flexibilidad.
 */
const limiter = rateLimit({
    // La ventana de tiempo en milisegundos.
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
    
    // El número máximo de peticiones permitidas por IP en la ventana de tiempo.
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10),
    
    // Mensaje que se enviará cuando se exceda el límite.
    message: {
        message: 'Demasiadas peticiones desde esta IP. Por favor, intente de nuevo más tarde.'
    },
    
    // Devuelve información del límite en las cabeceras `RateLimit-*`.
    standardHeaders: true, 
    
    // Deshabilita las cabeceras antiguas `X-RateLimit-*`.
    legacyHeaders: false, 
});

module.exports = limiter;