import client from "../config/db.js";
import { ObjectId } from "mongodb";

const db = client.db(process.env.DB_NAME);
const reviews = db.collection("reseñas");

export const calculateMovieRating = async (movieId) => {
  const revs = await reviews.find({ peliculaId: new ObjectId(movieId) }).toArray();
  if (!revs.length) return null;

  // Promedio calificaciones
  const promedio = revs.reduce((s, r) => s + (r.calificacion || 0), 0) / revs.length;

  // Likes vs dislikes score (net likes per review, averaged)
  const netLikesAvg = revs.reduce((s, r) => s + ((r.likes?.length || 0) - (r.dislikes?.length || 0)), 0) / revs.length;

  // Factor tiempo: más reciente => mayor peso (últimos 30 días)
  const now = new Date();
  const timeFactor = revs.reduce((s, r) => {
    const days = (now - new Date(r.fecha)) / (1000 * 60 * 60 * 24);
    return s + Math.max(0, (30 - days) / 30); // 1..0
  }, 0) / revs.length;

  // Peso: promedio 60%, netLikes 30% (normalizando), time 10%
  const normalizedNetLikes = Math.tanh(netLikesAvg / 5) * 10; // escala a ~[-10,10] luego a 0-10-ish
  const ranking = (promedio * 0.6) + ( (normalizedNetLikes + 10)/2 * 0.3 ) + (timeFactor * 10 * 0.1);

  // return rounded
  return Math.round(ranking * 100) / 100;
};
