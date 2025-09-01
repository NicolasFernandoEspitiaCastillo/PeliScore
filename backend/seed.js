import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

// Rutas
import categoryRoutes from "./routes/categoryRoutes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Conexión a la base de datos
connectDB()
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Rutas
app.use("/api/categories", categoryRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 API funcionando correctamente");
});

export default app;
