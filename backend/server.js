// Importación de módulos principales
require('dotenv').config(); // Carga las variables de entorno primero
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const semver = require('semver');

// Importación de configuraciones y middlewares locales
const { connectDB } = require('./config/database');
const rateLimiter = require('./middlewares/rateLimit.middleware');
const errorHandler = require('./middlewares/error.middleware');
const configureSwagger = require('./config/swagger');

// Importación de las rutas de la aplicación
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const contentRoutes = require('./routes/content.routes');
const reviewRoutes = require('./routes/review.routes');

// --- INICIALIZACIÓN Y CONFIGURACIÓN ---
const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos
connectDB();

// --- MIDDLEWARES GLOBALES ---
app.use(cors()); // Habilita Cross-Origin Resource Sharing
app.use(express.json()); // Parsea bodies de peticiones con formato JSON
app.use(express.urlencoded({ extended: true })); // Parsea bodies con formato URL-encoded
app.use(rateLimiter); // Aplica el límite de peticiones a todas las rutas

// Configuración de Passport para autenticación JWT
app.use(passport.initialize());
require('./config/passport')(passport);

// --- DEFINICIÓN DE RUTAS ---
const apiVersion = semver.major(process.env.API_VERSION);
const apiPrefix = `/api/v${apiVersion}`;

// Ruta de bienvenida a la API
app.get(apiPrefix, (req, res) => {
    res.json({ 
        message: `🚀 Bienvenido a la API de PeliScore v${apiVersion}.0`,
        documentation: "/api-docs" 
    });
});

// Montaje de las rutas de la aplicación
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/categories`, categoryRoutes);
app.use(`${apiPrefix}/content`, contentRoutes);
app.use(`${apiPrefix}/reviews`, reviewRoutes);

// --- DOCUMENTACIÓN Y MANEJO DE ERRORES ---

// Configuración de Swagger para la documentación interactiva
configureSwagger(app);

// Middleware para manejar errores. Debe ser el último en la cadena.
app.use(errorHandler);

// --- ARRANQUE DEL SERVIDOR ---
app.listen(PORT, () => {
    console.log(`✅ Servidor escuchando en el puerto ${PORT}`);
    console.log(`📚 Documentación de API disponible en http://localhost:${PORT}/api-docs`);
});