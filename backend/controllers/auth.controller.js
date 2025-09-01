import { connectDB } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const db = await connectDB();
    const { nombre, email, password, rol } = req.body;

    const existe = await db.collection("users").findOne({ email });
    if (existe) return res.status(400).json({ error: "Email ya registrado" });

    const hashed = await bcrypt.hash(password, 10);

    const result = await db.collection("users").insertOne({
      nombre,
      email,
      password: hashed,
      rol: rol || "usuario",
    });

    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

export const login = async (req, res) => {
  try {
    const db = await connectDB();
    const { email, password } = req.body;

    const user = await db.collection("users").findOne({ email });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Credenciales inválidas" });

    const token = jwt.sign(
      { id: user._id, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({ token });
  } catch {
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
};
