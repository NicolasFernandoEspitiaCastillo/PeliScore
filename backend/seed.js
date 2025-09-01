// Importar las dependencias necesarias
require('dotenv').config(); // Para usar las variables de entorno de tu archivo .env
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

// --- DATOS DE PRUEBA ---
// Aquí puedes añadir, quitar o modificar los datos que quieras inyectar.

const usersData = [
    { _id: new ObjectId(), username: 'admin_user', email: 'admin@example.com', password: 'password123', role: 'admin' },
    { _id: new ObjectId(), username: 'test_user_1', email: 'user1@example.com', password: 'password123', role: 'user' },
    { _id: new ObjectId(), username: 'test_user_2', email: 'user2@example.com', password: 'password123', role: 'user' },
];

const categoriesData = [
    { _id: new ObjectId(), name: 'Ciencia Ficcion' },
    { _id: new ObjectId(), name: 'Anime' },
    { _id: new ObjectId(), name: 'Fantasia' },
    { _id: new ObjectId(), name: 'Superheroes' },
];

const contentData = [
    {
        title: 'Blade Runner 2049',
        description: 'Un joven blade runner descubre un secreto largamente oculto que podría sumir en el caos lo que queda de la sociedad.',
        categoryId: categoriesData[0]._id, // Ciencia Ficcion
        year: 2017,
        status: 'approved',
        submittedBy: usersData[0]._id, // admin_user
    },
    {
        title: 'Shingeki no Kyojin',
        description: 'En un mundo post-apocalíptico, la humanidad lucha por sobrevivir contra titanes devoradores de hombres.',
        categoryId: categoriesData[1]._id, // Anime
        year: 2013,
        status: 'approved',
        submittedBy: usersData[0]._id, // admin_user
    },
    {
        title: 'El Señor de los Anillos: La Comunidad del Anillo',
        description: 'Un hobbit de la Comarca y ocho compañeros emprenden un viaje para destruir el poderoso Anillo Único.',
        categoryId: categoriesData[2]._id, // Fantasia
        year: 2001,
        status: 'approved',
        submittedBy: usersData[0]._id, // admin_user
    },
    {
        title: 'The Mandalorian',
        description: 'Las aventuras de un cazarrecompensas mandaloriano en los confines de la galaxia.',
        categoryId: categoriesData[0]._id, // Ciencia Ficcion
        year: 2019,
        status: 'pending', // Este contenido quedará pendiente de aprobación
        submittedBy: usersData[1]._id, // test_user_1
    },
];

// --- LÓGICA DEL SCRIPT ---

const seedDatabase = async () => {
    // 1. Conectar al cliente de MongoDB
    const client = new MongoClient(process.env.MONGO_URI);

    try {
        // **VALIDACIÓN DE CONEXIÓN**
        await client.connect();
        console.log('✅ Conexión a MongoDB exitosa.');

        const db = client.db(process.env.DB_NAME);

        // 2. Limpiar las colecciones existentes para evitar duplicados
        console.log('🧹 Limpiando colecciones...');
        await db.collection('users').deleteMany({});
        await db.collection('categories').deleteMany({});
        await db.collection('content').deleteMany({});
        await db.collection('reviews').deleteMany({}); // Añade las colecciones que necesites

        // 3. Hashear las contraseñas de los usuarios de prueba
        const hashedUsers = await Promise.all(
            usersData.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return { ...user, password: hashedPassword, createdAt: new Date() };
            })
        );

        // 4. **INYECCIÓN DE DATOS**
        console.log('🌱 Inyectando datos de prueba...');
        
        await db.collection('users').insertMany(hashedUsers);
        console.log('   - Usuarios inyectados.');

        await db.collection('categories').insertMany(categoriesData.map(cat => ({ ...cat, createdAt: new Date() })));
        console.log('   - Categorías inyectadas.');

        await db.collection('content').insertMany(contentData.map(c => ({
            ...c,
            averageRating: 0,
            reviewCount: 0,
            createdAt: new Date(),
        })));
        console.log('   - Contenido inyectado.');
        
        // Opcional: Inyectar algunas reseñas de prueba
        const contentForReview = await db.collection('content').findOne({ title: 'Blade Runner 2049' });
        if (contentForReview) {
            await db.collection('reviews').insertOne({
                contentId: contentForReview._id,
                userId: usersData[1]._id,
                title: "Una obra maestra visual",
                comment: "La cinematografía y la atmósfera son increíbles. Una digna secuela.",
                rating: 10,
                likes: [usersData[2]._id], // A user2 le gustó esta reseña
                dislikes: [],
                createdAt: new Date(),
            });
            // Actualizar el rating del contenido
            await db.collection('content').updateOne(
                { _id: contentForReview._id },
                { $set: { averageRating: 10, reviewCount: 1 } }
            );
            console.log('   - Reseñas de prueba inyectadas.');
        }

        console.log('\n✨ ¡Base de datos poblada exitosamente!');

    } catch (error) {
        console.error('❌ Error durante el proceso de inyección de datos:', error);
    } finally {
        // 5. Cerrar la conexión
        await client.close();
        console.log('🔌 Conexión a MongoDB cerrada.');
    }
};

// Ejecutar la función
seedDatabase();