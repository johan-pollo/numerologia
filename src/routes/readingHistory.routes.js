import express from "express";
import { obtenerLecturas } from "../controllers/reading.controller.js";
import { autenticar } from "../middlewares/autenticacion.js";

const router = express.Router();

router.use(autenticar);
router.get("/history", obtenerLecturas);

export default router;
