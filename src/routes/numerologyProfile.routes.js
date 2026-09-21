import express from "express";

import {
    crearPerfil,
    obtenerPerfiles,
    obtenerPerfil,
    actualizarPerfil,
    eliminarPerfil
} from "../controllers/numerologyProfile.controller.js";

import { idValidator } from "../validators/uservalidator.js";
import { validarCampos } from "../middlewares/validarcampos.js";
import { autenticar } from "../middlewares/autenticacion.js";

const router = express.Router();

router.use(autenticar);

router.post(
    "/",
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