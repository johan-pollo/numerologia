import express from "express";

import {
    crearAuditLog,
    obtenerAuditLogs,
    obtenerAuditLog,
    actualizarAuditLog,
    eliminarAuditLog
} from "../controladores/auditLog.controller.js";

import { idValidator } from "../validadores/identificador.validator.js";
import {
    crearAuditLogValidator,
    actualizarAuditLogValidator
} from "../validadores/auditoria.validator.js";
import { validarCampos } from "../intermediarios/validarcampos.js";
import { autenticar } from "../intermediarios/autenticacion.js";

const router = express.Router();

router.use(autenticar);

router.post(
    "/",
    crearAuditLogValidator,
    validarCampos,
    crearAuditLog
);

router.get(
    "/",
    obtenerAuditLogs
);

router.get(
    "/:id",
    idValidator,
    validarCampos,
    obtenerAuditLog
);

router.put(
    "/:id",
    idValidator,
    actualizarAuditLogValidator,
    validarCampos,
    actualizarAuditLog
);

router.delete(
    "/:id",
    idValidator,
    validarCampos,
    eliminarAuditLog
);

export default router;