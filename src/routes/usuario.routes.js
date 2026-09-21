import express from "express";

import {
    crearUsuario,
    iniciarSesion,
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
} from "../controllers/usuario.controller.js";

import {
    crearUsuarioValidator,
    actualizarUsuarioValidator,
    loginValidator,
    idValidator
} from "../validators/uservalidator.js";

import { validarCampos } from "../middlewares/validarcampos.js";
import { autenticar } from "../middlewares/autenticacion.js";

const router = express.Router();

router.post(
    "/",
    crearUsuarioValidator,
    validarCampos,
    crearUsuario
);

router.post(
    "/login",
    loginValidator,
    validarCampos,
    iniciarSesion
);

router.use(autenticar);

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