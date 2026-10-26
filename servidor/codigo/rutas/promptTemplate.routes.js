import express from "express";
import {
    crearPlantilla,
    obtenerPlantillas,
    obtenerPlantilla,
    actualizarPlantilla,
    eliminarPlantilla
} from "../controladores/promptTemplate.controller.js";
import {
    crearPlantillaValidator,
    actualizarPlantillaValidator
} from "../validadores/plantilla.validator.js";
import { idValidator } from "../validadores/identificador.validator.js";
import { validarCampos } from "../intermediarios/validarcampos.js";
import { autenticar } from "../intermediarios/autenticacion.js";

const router = express.Router();

router.use(autenticar);

router.post("/", crearPlantillaValidator, validarCampos, crearPlantilla);
router.get("/", obtenerPlantillas);
router.get("/:id", idValidator, validarCampos, obtenerPlantilla);
router.put(
    "/:id",
    idValidator,
    actualizarPlantillaValidator,
    validarCampos,
    actualizarPlantilla
);
router.delete("/:id", idValidator, validarCampos, eliminarPlantilla);

export default router;
