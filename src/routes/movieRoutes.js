import express from "express";
import { createMovie, updateMovie, deleteMovie, listMovies, getMovie } from "../controllers/movieController.js";
import { movieCreateValidator } from "../utils/validators.js";
import { validationResult } from "express-validator";

const router = express.Router();

router.get("/", listMovies);
router.get("/:id", getMovie);

router.post("/", movieCreateValidator, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, createMovie);

router.put("/:id", updateMovie);
router.delete("/:id", deleteMovie);

export default router;
