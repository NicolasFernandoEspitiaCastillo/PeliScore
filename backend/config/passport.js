const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { getDB } = require('./database');
const { ObjectId } = require('mongodb');

// Opciones para configurar la estrategia JWT.
const opts = {
    // Extrae el token del encabezado 'Authorization' como un 'Bearer' token.
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // La clave secreta para verificar la firma del token.
    secretOrKey: process.env.JWT_SECRET,
};

/**
 * Configura y exporta la estrategia de Passport.
 * @param {PassportStatic} passport - La instancia de Passport inyectada desde server.js.
 */
module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                const db = getDB();
                const usersCollection = db.collection('users');

                // Busca al usuario en la base de datos usando el ID del payload del token.
                const user = await usersCollection.findOne(
                    { _id: new ObjectId(jwt_payload.id) },
                    // Proyección para excluir la contraseña del objeto de usuario resultante.
                    { projection: { password: 0 } }
                );

                if (user) {
                    // Si el usuario existe, la autenticación es exitosa.
                    // El objeto 'user' se adjuntará a `req.user`.
                    return done(null, user);
                } else {
                    // Si el usuario no se encuentra, la autenticación falla.
                    return done(null, false);
                }
            } catch (error) {
                console.error('Error en la estrategia JWT:', error);
                return done(error, false);
            }
        })
    );
};