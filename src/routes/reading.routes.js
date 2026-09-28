import express from "express";

import {
    crearLectura,
    obtenerLecturas,
    obtenerLectura,
    actualizarLectura,
    eliminarLectura
} from "../controllers/reading.controller.js";

import { crearLecturaValidator, idValidator } from "../validators/uservalidator.js";
import { validarCampos } from "../middlewares/validarcampos.js";
import { autenticar } from "../middlewares/autenticacion.js";

const router = express.Router();

router.use(autenticar);

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