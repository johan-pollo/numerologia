import AuditLog from "../models/AuditLogs.js";

export const obtenerAuditLogs = async (req, res) => {
    try {
        const auditLogs = await AuditLog.find({ user_id: req.usuarioId })
            .sort({ timestamp: -1 })
            .limit(100);
        return res.status(200).json(auditLogs);
    } catch (error) {
        console.error("Error al obtener los registros de auditoría:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener los registros de auditoría"
        });
    }
};

export const obtenerAuditLog = async (req, res) => {
    try {
        const auditLog = await AuditLog.findOne({
            _id: req.params.id,
            user_id: req.usuarioId
        });

        if (!auditLog) {
            return res.status(404).json({
                mensaje: "Registro de auditoría no encontrado"
            });
        }

        return res.status(200).json(auditLog);
    } catch (error) {
        console.error("Error al obtener el registro de auditoría:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener el registro de auditoría"
        });
    }
};
