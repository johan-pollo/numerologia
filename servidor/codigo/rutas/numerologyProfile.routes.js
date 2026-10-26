import express from "express";

import {
    crearPerfil,
    obtenerPerfiles,
    obtenerPerfil,
    actualizarPerfil,
    eliminarPerfil
} from "../controladores/numerologyProfile.controller.js";

import {
    crearPerfilValidator,
    actualizarPerfilValidator,
} from "../validadores/perfil.validator.js";
import { idValidator } from "../validadores/identificador.validator.js";
import { validarCampos } from "../intermediarios/validarcampos.js";
import { autenticar } from "../intermediarios/autenticacion.js";

const router = express.Router();

router.use(autenticar);

router.post(
    "/",
    crearPerfilValidator,
    validarCampos,
    crearPerfil
);

router.get(
    "/",
    obtenerPerfiles
);

router.get(
    "/:id",
    idValidator,
    validarCampos,
    obtenerPerfil
);

router.put(
    "/:id",
    idValidator,
    actualizarPerfilValidator,
    validarCampos,
    actualizarPerfil
);

router.delete(
    "/:id",
    idValidator,
    validarCampos,
    eliminarPerfil
);

export default router;