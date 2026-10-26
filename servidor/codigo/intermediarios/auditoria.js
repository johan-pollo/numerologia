import mongoose from "mongoose";
import AuditLog from "../modelos/AuditLogs.js";

const rutasExcluidas = new Set(["/api/auditoria", "/api/v1/audit"]);
let avisoSinConexionRegistrado = false;

export const registrarAuditoria = (req, res, next) => {
    res.once("finish", () => {
        if (process.env.NODE_ENV === "test") return;

        const ruta = req.originalUrl.split("?")[0];
        if (
            [...rutasExcluidas].some((rutaExcluida) =>
                ruta === rutaExcluida || ruta.startsWith(`${rutaExcluida}/`)
            )
        ) return;

        if (mongoose.connection.readyState !== 1) {
            if (!avisoSinConexionRegistrado) {
                console.error("No fue posible guardar la auditoría porque MongoDB no está conectado");
                avisoSinConexionRegistrado = true;
            }
            return;
        }

        avisoSinConexionRegistrado = false;
        const registro = new AuditLog({
            endpoint: ruta,
            metodo: req.method,
            status_code: res.statusCode,
            user_id: req.usuarioId
        });

        registro.save().catch((error) => {
            console.error("No fue posible guardar el registro de auditoría:", error.message);
        });
    });

    next();
};
