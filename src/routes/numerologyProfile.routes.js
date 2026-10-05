import express from "express";

import {
    crearPerfil,
    obtenerPerfiles,
    obtenerPerfil,
    actualizarPerfil,
    eliminarPerfil
} from "../controllers/numerologyProfile.controller.js";

import {
    crearPerfilValidator,
    actualizarPerfilValidator,
    idValidator
} from "../validators/uservalidator.js";
import { validarCampos } from "../middlewares/validarcampos.js";
import { autenticar } from "../middlewares/autenticacion.js";

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