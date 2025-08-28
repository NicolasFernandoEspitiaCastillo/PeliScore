import client from "../config/db.js";
import { ObjectId } from "mongodb";

const db = client.db(process.env.DB_NAME);
const movies = db.collection("peliculas");

export const findMovieById = async (id) => {
  return movies.findOne({ _id: new ObjectId(id) });
};

export const titleExists = async (titulo) => {
  const res = await movies.findOne({ titulo: { $regex: `^${titulo}$`, $options: "i" } });
  return !!res;
};
