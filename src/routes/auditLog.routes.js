import express from "express";

import {
    crearAuditLog,
    obtenerAuditLogs,
    obtenerAuditLog,
    actualizarAuditLog,
    eliminarAuditLog
} from "../controllers/auditLog.controller.js";

import { idValidator } from "../validators/uservalidator.js";
import { validarCampos } from "../middlewares/validarcampos.js";
import { autenticar } from "../middlewares/autenticacion.js";

const router = express.Router();

router.use(autenticar);

router.post(
    "/",
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