import express from "express";

import {
    crearCompatibilidad,
    obtenerCompatibilidades,
    obtenerCompatibilidad,
    actualizarCompatibilidad,
    eliminarCompatibilidad
} from "../controllers/compatibilityMatch.controller.js";

import { idValidator } from "../validators/uservalidator.js";
import { validarCampos } from "../middlewares/validarcampos.js";
import { autenticar } from "../middlewares/autenticacion.js";

const router = express.Router();

router.use(autenticar);

router.post(
    "/",
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