import { connectDB } from "../config/db.js";
import { ObjectId } from "mongodb";

export const listMovies = async (req, res) => {
  try {
    const db = await connectDB();
    const movies = await db.collection("movies").find().toArray();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: "Error al listar películas" });
  }
};

export const getMovie = async (req, res) => {
  try {
    const db = await connectDB();
    const movie = await db.collection("movies").findOne({ _id: new ObjectId(req.params.id) });
    if (!movie) return res.status(404).json({ error: "Película no encontrada" });
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener película" });
  }
};

export const createMovie = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("movies").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al crear película" });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("movies").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar película" });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const db = await connectDB();
    const result = await db.collection("movies").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Error al eliminar película" });
  }
};
