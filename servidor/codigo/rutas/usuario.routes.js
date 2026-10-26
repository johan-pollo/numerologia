import express from "express";

import {
    crearUsuario,
    iniciarSesion,
    obtenerUsuarios,
    obtenerUsuario,
    actualizarUsuario,
    eliminarUsuario
} from "../controladores/usuario.controller.js";

import {
    crearUsuarioValidator,
    actualizarUsuarioValidator,
    loginValidator
} from "../validadores/usuario.validator.js";
import { idValidator } from "../validadores/identificador.validator.js";

import { validarCampos } from "../intermediarios/validarcampos.js";
import { autenticar } from "../intermediarios/autenticacion.js";

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