import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const listReviews = async (req, res) => {
  try {
    const db = await connectDB();
    const reviews = await db.collection("reviews").find().toArray();
    res.json(reviews);
  } catch {
    res.status(500).json({ error: "Error al listar reseñas" });
  }
};

export const createReview = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("reviews").insertOne({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: "Error al crear reseña" });
  }
};
