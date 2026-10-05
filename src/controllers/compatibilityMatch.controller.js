import CompatibilityMatch from "../models/CompatibilityMatches.js";

export const crearCompatibilidad = async (req, res) => {
    try {
        const { usuario_2, puntaje, interpretacion_ia } = req.body;
        const compatibilidad = new CompatibilityMatch({
            usuario_1: req.usuarioId,
            usuario_2,
            puntaje,
            interpretacion_ia
        });
        await compatibilidad.save();

        return res.status(201).json({
            mensaje: "Compatibilidad creada correctamente",
            compatibilidad
        });
    } catch (error) {
        console.error("Error al crear la compatibilidad:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al crear la compatibilidad",
        });
    }
};

export const obtenerCompatibilidades = async (req, res) => {
    try {
        const compatibilidades = await CompatibilityMatch.find({
            $or: [{ usuario_1: req.usuarioId }, { usuario_2: req.usuarioId }]
        }).sort({ _id: -1 }).limit(100);

        return res.status(200).json(compatibilidades);
    } catch (error) {
        console.error("Error al obtener las compatibilidades:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener las compatibilidades",
        });
    }
};

export const obtenerCompatibilidad = async (req, res) => {
    try {
        const compatibilidad = await CompatibilityMatch.findOne({
            _id: req.params.id,
            $or: [{ usuario_1: req.usuarioId }, { usuario_2: req.usuarioId }]
        });

        if (!compatibilidad) {
            return res.status(404).json({
                mensaje: "Compatibilidad no encontrada"
            });
        }

        return res.status(200).json(compatibilidad);
    } catch (error) {
        console.error("Error al obtener la compatibilidad:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener la compatibilidad",
        });
    }
};

export const actualizarCompatibilidad = async (req, res) => {
    try {
        const { puntaje, interpretacion_ia } = req.body;
        const compatibilidad = await CompatibilityMatch.findOneAndUpdate(
            {
                _id: req.params.id,
                usuario_1: req.usuarioId
            },
            { puntaje, interpretacion_ia },
            { new: true, runValidators: true }
        );

        if (!compatibilidad) {
            return res.status(404).json({
                mensaje: "Compatibilidad no encontrada"
            });
        }

        return res.status(200).json({
            mensaje: "Compatibilidad actualizada correctamente",
            compatibilidad
        });
    } catch (error) {
        console.error("Error al actualizar la compatibilidad:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al actualizar la compatibilidad",
        });
    }
};

export const eliminarCompatibilidad = async (req, res) => {
    try {
        const compatibilidad = await CompatibilityMatch.findOneAndDelete({
            _id: req.params.id,
            usuario_1: req.usuarioId
        });

        if (!compatibilidad) {
            return res.status(404).json({
                mensaje: "Compatibilidad no encontrada"
            });
        }

        return res.status(200).json({
            mensaje: "Compatibilidad eliminada correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar la compatibilidad:", error.message);
        return res.status(500).json({
            mensaje: "Error al eliminar la compatibilidad",
        });
    }
};