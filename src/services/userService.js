import client from "../config/db.js";

const db = client.db(process.env.DB_NAME);
const users = db.collection("usuarios");

export const findUserByEmail = async (email) => {
  return users.findOne({ email });
};
