import AuditLog from "../modelos/AuditLogs.js";

export const crearAuditLog = async (req, res) => {
    try {
        const { endpoint, metodo, status_code } = req.body;
        const auditLog = await AuditLog.create({
            endpoint,
            metodo,
            status_code,
            user_id: req.usuarioId
        });
        return res.status(201).json(auditLog);
    } catch (error) {
        console.error("Error al crear el registro de auditoría:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al crear el registro de auditoría"
        });
    }
};

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

export const actualizarAuditLog = async (req, res) => {
    try {
        const { endpoint, metodo, status_code } = req.body;
        const campos = {};
        if (endpoint !== undefined) campos.endpoint = endpoint;
        if (metodo !== undefined) campos.metodo = metodo;
        if (status_code !== undefined) campos.status_code = status_code;

        const auditLog = await AuditLog.findOneAndUpdate(
            { _id: req.params.id, user_id: req.usuarioId },
            campos,
            { new: true, runValidators: true }
        );
        if (!auditLog) {
            return res.status(404).json({
                mensaje: "Registro de auditoría no encontrado"
            });
        }
        return res.status(200).json(auditLog);
    } catch (error) {
        console.error("Error al actualizar el registro de auditoría:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al actualizar el registro de auditoría"
        });
    }
};

export const eliminarAuditLog = async (req, res) => {
    try {
        const auditLog = await AuditLog.findOneAndDelete({
            _id: req.params.id,
            user_id: req.usuarioId
        });
        if (!auditLog) {
            return res.status(404).json({
                mensaje: "Registro de auditoría no encontrado"
            });
        }
        return res.status(200).json({
            mensaje: "Registro de auditoría eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar el registro de auditoría:", error.message);
        return res.status(500).json({
            mensaje: "Error al eliminar el registro de auditoría"
        });
    }
};
