import CompatibilityMatch from "../models/CompatibilityMatches.js";

export const crearCompatibilidad = async (req, res) => {
    try {
        const compatibilidad = new CompatibilityMatch(req.body);
        await compatibilidad.save();

        res.status(201).json({
            mensaje: "Compatibilidad creada correctamente",
            compatibilidad
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear la compatibilidad",
            error: error.message
        });
    }
};

export const obtenerCompatibilidades = async (req, res) => {
    try {
        const compatibilidades = await CompatibilityMatch.find();

        res.status(200).json(compatibilidades);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las compatibilidades",
            error: error.message
        });
    }
};

export const obtenerCompatibilidad = async (req, res) => {
    try {
        const compatibilidad = await CompatibilityMatch.findById(req.params.id);

        if (!compatibilidad) {
            return res.status(404).json({
                mensaje: "Compatibilidad no encontrada"
            });
        }

        res.status(200).json(compatibilidad);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener la compatibilidad",
            error: error.message
        });
    }
};

export const actualizarCompatibilidad = async (req, res) => {
    try {
        const compatibilidad = await CompatibilityMatch.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!compatibilidad) {
            return res.status(404).json({
                mensaje: "Compatibilidad no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Compatibilidad actualizada correctamente",
            compatibilidad
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la compatibilidad",
            error: error.message
        });
    }
};

export const eliminarCompatibilidad = async (req, res) => {
    try {
        const compatibilidad = await CompatibilityMatch.findByIdAndDelete(req.params.id);

        if (!compatibilidad) {
            return res.status(404).json({
                mensaje: "Compatibilidad no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Compatibilidad eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la compatibilidad",
            error: error.message
        });
    }
};