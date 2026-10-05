import express from "express";
import {
    calcularPerfil,
    obtenerPerfilAutenticado
} from "../controllers/numerologyProfile.controller.js";
import { autenticar } from "../middlewares/autenticacion.js";

const router = express.Router();

router.use(autenticar);
router.post("/calculate", calcularPerfil);
router.get("/profile", obtenerPerfilAutenticado);

export default router;
