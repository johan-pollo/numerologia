import express from "express";

import {
    generarLecturaConGemini,
    crearLectura,
    obtenerLecturas,
    obtenerLectura,
    actualizarLectura,
    eliminarLectura
} from "../controladores/reading.controller.js";

import {
    crearLecturaConGeminiValidator,
    crearLecturaValidator,
    actualizarLecturaValidator
} from "../validadores/lectura.validator.js";
import { idValidator } from "../validadores/identificador.validator.js";
import { validarCampos } from "../intermediarios/validarcampos.js";
import { autenticar } from "../intermediarios/autenticacion.js";

const router = express.Router();

router.use(autenticar);

router.post(
    "/generate",
    crearLecturaConGeminiValidator,
    validarCampos,
    generarLecturaConGemini
);

router.post(
    "/generar",
    crearLecturaConGeminiValidator,
    validarCampos,
    generarLecturaConGemini
);

router.post(
    "/",
    crearLecturaValidator,
    validarCampos,
    crearLectura
);

router.get(
    "/",
    obtenerLecturas
);

router.get(
    "/:id",
    idValidator,
    validarCampos,
    obtenerLectura
);

router.put(
    "/:id",
    idValidator,
    actualizarLecturaValidator,
    validarCampos,
    actualizarLectura
);

router.delete(
    "/:id",
    idValidator,
    validarCampos,
    eliminarLectura
);

export default router;