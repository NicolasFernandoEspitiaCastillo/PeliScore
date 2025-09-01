/**
 * Clase de Error Personalizada para la aplicación.
 * Permite crear errores con un mensaje y un código de estado HTTP asociado.
 * Extiende la clase nativa de Error de JavaScript.
 */
class CustomError extends Error {
    /**
     * @param {string} message - El mensaje de error que se mostrará.
     * @param {number} statusCode - El código de estado HTTP (ej. 400, 404, 500).
     */
    constructor(message, statusCode) {
        // Llama al constructor de la clase padre (Error) con el mensaje.
        super(message);

        // Asigna el código de estado y el nombre del error.
        this.statusCode = statusCode;
        this.name = this.constructor.name;

        // Captura el stack trace para un debugging más claro, excluyendo el constructor de esta clase.
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = CustomError;