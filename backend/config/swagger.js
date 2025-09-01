const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Metadatos y configuración base de la API para Swagger.
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'PeliScore API',
            version: process.env.API_VERSION || '1.0.0',
            description: 'API RESTful para gestionar películas, series, reseñas y usuarios en la plataforma PeliScore.',
            contact: {
                name: "Soporte del Proyecto",
                email: "soporte@example.com"
            }
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT}/api/v1`,
                description: 'Servidor de Desarrollo Local'
            }
        ],
        // Define el esquema de seguridad para JWT.
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Ingresa el token JWT en formato: Bearer <token>'
                }
            }
        },
        security: [{
            bearerAuth: [] // Aplica la seguridad JWT a todos los endpoints por defecto.
        }]
    },
    // Ruta a los archivos que contienen las anotaciones de la API.
    apis: ['./backend/routes/*.js'],
};

// Genera la especificación de Swagger basada en las opciones.
const swaggerSpec = swaggerJSDoc(options);

/**
 * Configura la ruta de la documentación de Swagger en la aplicación Express.
 * @param {Express} app - La instancia de la aplicación Express.
 */
const configureSwagger = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = configureSwagger;