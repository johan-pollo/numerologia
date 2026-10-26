import express from "express";
import {
    crearUsuario,
    iniciarSesion
} from "../controladores/usuario.controller.js";
import {
    crearUsuarioValidator,
    loginValidator
} from "../validadores/usuario.validator.js";
import { validarCampos } from "../intermediarios/validarcampos.js";

const router = express.Router();

router.post("/register", crearUsuarioValidator, validarCampos, crearUsuario);
router.post("/login", loginValidator, validarCampos, iniciarSesion);

export default router;
