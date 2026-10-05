import express from "express";

import {
    obtenerAuditLogs,
    obtenerAuditLog
} from "../controllers/auditLog.controller.js";

import { idValidator } from "../validators/uservalidator.js";
import { validarCampos } from "../middlewares/validarcampos.js";
import { autenticar } from "../middlewares/autenticacion.js";

const router = express.Router();

router.use(autenticar);

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

export default router;