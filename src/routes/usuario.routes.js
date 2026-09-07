import express from "express";

import {
    crearUsuario,
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
} from "../controllers/usuario.controller.js";

import {
    crearUsuarioValidator,
    actualizarUsuarioValidator,
    idValidator
} from "../validators/uservalidator.js";

import { validarCampos } from "../middlewares/validarcampos.js";

const router = express.Router();

router.post(
    "/",
    crearUsuarioValidator,
    validarCampos,
    crearUsuario
);

router.get(
    "/",
    obtenerUsuarios
);

router.get(
    "/:id",
    idValidator,
    validarCampos,
    obtenerUsuario
);

router.put(
    "/:id",
    idValidator,
    actualizarUsuarioValidator,
    validarCampos,
    actualizarUsuario
);

router.delete(
    "/:id",
    idValidator,
    validarCampos,
    eliminarUsuario
);

export default router;