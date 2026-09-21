import AuditLog from "../models/AuditLogs.js";

export const crearAuditLog = async (req, res) => {
    try {
        const auditLog = new AuditLog(req.body);
        await auditLog.save();

        res.status(201).json({
            mensaje: "Registro de auditoría creado correctamente",
            auditLog
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el registro de auditoría",
            error: error.message
        });
    }
};

export const obtenerAuditLogs = async (req, res) => {
    try {
        const auditLogs = await AuditLog.find();

        res.status(200).json(auditLogs);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los registros de auditoría",
            error: error.message
        });
    }
};

export const obtenerAuditLog = async (req, res) => {
    try {
        const auditLog = await AuditLog.findById(req.params.id);

        if (!auditLog) {
            return res.status(404).json({
                mensaje: "Registro de auditoría no encontrado"
            });
        }

        res.status(200).json(auditLog);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el registro de auditoría",
            error: error.message
        });
    }
};

export const actualizarAuditLog = async (req, res) => {
    try {
        const auditLog = await AuditLog.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!auditLog) {
            return res.status(404).json({
                mensaje: "Registro de auditoría no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Registro de auditoría actualizado correctamente",
            auditLog
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el registro de auditoría",
            error: error.message
        });
    }
};

export const eliminarAuditLog = async (req, res) => {
    try {
        const auditLog = await AuditLog.findByIdAndDelete(req.params.id);

        if (!auditLog) {
            return res.status(404).json({
                mensaje: "Registro de auditoría no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Registro de auditoría eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el registro de auditoría",
            error: error.message
        });
    }
};