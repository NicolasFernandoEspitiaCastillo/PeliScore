import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017"; // cámbialo si tu conexión es diferente
const client = new MongoClient(uri);

let db;

export const connectDB = async () => {
  if (!db) {
    try {
      await client.connect();
      db = client.db("Karenflix"); // nombre de tu base de datos
      console.log("✅ Conectado a MongoDB");
    } catch (err) {
      console.error("❌ Error al conectar a MongoDB:", err);
      throw err;
    }
  }
  return db;
};
