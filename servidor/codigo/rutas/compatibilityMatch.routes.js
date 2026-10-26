import express from "express";

import {
    chequearCompatibilidad,
    crearCompatibilidad,
    obtenerCompatibilidades,
    obtenerCompatibilidad,
    actualizarCompatibilidad,
    eliminarCompatibilidad
} from "../controladores/compatibilityMatch.controller.js";

import {
    crearCompatibilidadValidator,
    actualizarCompatibilidadValidator,
    verificarCompatibilidadValidator
} from "../validadores/compatibilidad.validator.js";
import { idValidator } from "../validadores/identificador.validator.js";
import { validarCampos } from "../intermediarios/validarcampos.js";
import { autenticar } from "../intermediarios/autenticacion.js";

const router = express.Router();

router.use(autenticar);

router.post(
    "/check",
    verificarCompatibilidadValidator,
    validarCampos,
    chequearCompatibilidad
);

router.post(
    "/",
    crearCompatibilidadValidator,
    validarCampos,
    crearCompatibilidad
);

router.get(
    "/",
    obtenerCompatibilidades
);

router.get(
    "/:id",
    idValidator,
    validarCampos,
    obtenerCompatibilidad
);

router.put(
    "/:id",
    idValidator,
    actualizarCompatibilidadValidator,
    validarCampos,
    actualizarCompatibilidad
);

router.delete(
    "/:id",
    idValidator,
    validarCampos,
    eliminarCompatibilidad
);

export default router;