import express from "express";
import {
    calcularPerfil,
    obtenerPerfilAutenticado
} from "../controladores/numerologyProfile.controller.js";
import { autenticar } from "../intermediarios/autenticacion.js";

const router = express.Router();

router.use(autenticar);
router.post("/calculate", calcularPerfil);
router.get("/profile", obtenerPerfilAutenticado);

export default router;
