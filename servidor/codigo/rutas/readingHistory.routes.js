import express from "express";
import { obtenerLecturas } from "../controladores/reading.controller.js";
import { autenticar } from "../intermediarios/autenticacion.js";

const router = express.Router();

router.use(autenticar);
router.get("/history", obtenerLecturas);

export default router;
