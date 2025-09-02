# 📽️ Peliscore API

API RESTful para gestionar películas, animes y series geek, con autenticación segura, reseñas, rankings y panel de administración. Proyecto académico full-stack desarrollado con Node.js + Express para backend y HTML + CSS + JS puro para frontend.

# 🎯 Objetivo

El objetivo de este proyecto es ofrecer una plataforma donde los usuarios puedan registrar, calificar y rankear películas, animes y series geek, integrando un sistema de reseñas, categorías, autenticación con roles y administración de contenidos.

# 🛠️ Tecnologías utilizadas

### Backend: Node.js, Express

### Base de datos: MongoDB (driver oficial)

### Autenticación: Passport-JWT, jsonwebtoken, bcrypt

### Validaciones: express-validator

### Seguridad: express-rate-limit, dotenv, CORS

### Documentación: swagger-ui-express

### Versionado: semver
---
# 📂 Arquitectura
/config        -> Configuración (db, passport, rate-limit, etc.)
/controllers   -> Lógica de negocio de cada recurso
/models        -> Definición de colecciones y esquemas base
/routes        -> Definición de endpoints por recurso
/middlewares   -> Autenticación, validaciones, manejo de errores
/services      -> Operaciones complejas (ranking, transacciones)
/utils         -> Helpers, formateadores, respuestas

----

# ⚙️ Instalación

### Clonar el repositorio

git clone https://github.com/NicolasFernandoEspitiaCastillo/PeliScore


### Instalar dependencias

npm install


### Configurar variables de entorno en .env:

PORT=4000
MONGO_URI=mongodb://localhost:27017/
JWT_SECRET=UNA_CLAVE_SECRETA_MUY_LARGA_Y_DIFICIL_DE_ADIVINAR_123!@



### Ejecutar en desarrollo

cd backend
npm start

----

# 📌 Endpoints principales

## 🧑 Usuarios
### 🔐 Login
POST → http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "nico@mail.com",
  "password": "123456"
}

### 📋 Obtener todos los usuarios (solo admin)
GET → http://localhost:3000/api/users

### 👤 Obtener un usuario por ID
GET → http://localhost:3000/api/users/64f9b2e88f1b9c1234abcd56

### ✏️ Actualizar usuario
PUT → http://localhost:3000/api/users/64f9b2e88f1b9c1234abcd56
Content-Type: application/json

{
  "username": "NicoDev",
  "email": "nicoNuevo@mail.com"
}

### 🗑️ Eliminar usuario
DELETE → http://localhost:3000/api/users/64f9b2e88f1b9c1234abcd56

# 🎬 Películas

### 📋 Obtener todas las películas
GET → http://localhost:3000/api/movies

### 👀 Obtener película por ID
GET → http://localhost:3000/api/movies/64fa12f88a1c7e1234abcd90

### ✏️ Actualizar película
PUT → http://localhost:3000/api/movies/64fa12f88a1c7e1234abcd90
Content-Type: application/json

{
  "rating": 9,
  "description": "Actualizada: sigue siendo de las mejores historias."
}

### 🗑️ Eliminar película
DELETE → http://localhost:3000/api/movies/64fa12f88a1c7e1234abcd90

# ⭐ Reseñas

### ➕ Crear reseña
POST → http://localhost:3000/api/reviews
Content-Type: application/json

{
  "movieId": "64fa12f88a1c7e1234abcd90",
  "userId": "64f9b2e88f1b9c1234abcd56",
  "rating": 5,
  "comment": "Excelente anime"
}

### 📋 Obtener reseñas de una película
GET → http://localhost:3000/api/reviews/movie/64fa12f88a1c7e1234abcd90

### 📋 Obtener reseñas de un usuario
GET → http://localhost:3000/api/reviews/user/64f9b2e88f1b9c1234abcd56

# 🧪 Ejemplo de request en Insomnia
### Crear usuario
POST http://localhost:4000/api/v1/users/register
Content-Type: application/json

{
  "username": "nicolas",
  "email": "nicolas@example.com",
  "password": "123456"
}

### Login
POST http://localhost:4000/api/v1/users/login
Content-Type: application/json

{
  "email": "nicolas@example.com",
  "password": "123456"
}

### Crear reseña (con JWT)
POST http://localhost:4000/api/v1/reviews/64aef312e23f23
Authorization: Bearer <TOKEN_JWT>
Content-Type: application/json

{
  "title": "Muy buena",
  "comment": "Me encantó la animación",
  "rating": 9
}


----

# 🌐 Frontend

Repositorio: https://github.com/karina2025/PeliScore-FRONTEND

Desarrollado en HTML, CSS y JavaScript puro.

Pantallas mínimas:

Inicio

Registro/Login

Listado de películas

Detalle de película con reseñas

Panel admin