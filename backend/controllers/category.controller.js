import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const listCategories = async (req, res) => {
  try {
    const db = await connectDB();
    const categories = await db.collection("categories").find().toArray();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: "Error al listar categorías" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("categories").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al crear categoría" });
  }
};
