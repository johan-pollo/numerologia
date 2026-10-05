import express from "express";
import {
    crearUsuario,
    iniciarSesion
} from "../controllers/usuario.controller.js";
import {
    crearUsuarioValidator,
    loginValidator
} from "../validators/uservalidator.js";
import { validarCampos } from "../middlewares/validarcampos.js";

const router = express.Router();

router.post("/register", crearUsuarioValidator, validarCampos, crearUsuario);
router.post("/login", loginValidator, validarCampos, iniciarSesion);

export default router;
