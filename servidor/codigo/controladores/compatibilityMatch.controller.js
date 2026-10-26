import CompatibilityMatch from "../modelos/CompatibilityMatches.js";
import User from "../modelos/User.js";
import NumerologyProfile from "../modelos/NumerologyProfiles.js";
import {
    calcularPuntajeCompatibilidad,
    generarInterpretacionCompatibilidad
} from "../servicios/compatibilidad.service.js";

export const chequearCompatibilidad = async (req, res) => {
    try {
        const { usuario_2 } = req.body;
        const usuarioSegundo = await User.findById(usuario_2).select("_id activo");
        if (!usuarioSegundo || usuarioSegundo.activo === false) {
            return res.status(404).json({ mensaje: "Segundo usuario no encontrado" });
        }

        const [perfilPrimero, perfilSegundo] = await Promise.all([
            NumerologyProfile.findOne({ usuario: req.usuarioId }),
            NumerologyProfile.findOne({ usuario: usuarioSegundo._id })
        ]);
        if (!perfilPrimero || !perfilSegundo) {
            return res.status(404).json({ mensaje: "No se encontraron ambos perfiles numerológicos" });
        }

        const campos = ["numero_vida", "numero_expresion", "numero_alma"];
        const numeros = Object.fromEntries(campos.map((campo) => [
            campo,
            {
                usuario_1: perfilPrimero[campo],
                usuario_2: perfilSegundo[campo]
            }
        ]));
        const puntaje = calcularPuntajeCompatibilidad(perfilPrimero, perfilSegundo);

        let interpretacion_ia;
        try {
            interpretacion_ia = await generarInterpretacionCompatibilidad({
                puntaje,
                numeros
            });
        } catch (error) {
            console.error("Error al interpretar la compatibilidad con Gemini:", error.message);
            return res.status(503).json({
                mensaje: "El servicio de compatibilidad no está disponible"
            });
        }

        const compatibilidad = await CompatibilityMatch.create({
            usuario_1: req.usuarioId,
            usuario_2: usuarioSegundo._id,
            puntaje,
            interpretacion_ia
        });

        return res.status(201).json({
            mensaje: "Compatibilidad calculada correctamente",
            compatibilidad
        });
    } catch (error) {
        console.error("Error al calcular la compatibilidad:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al calcular la compatibilidad"
        });
    }
};

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