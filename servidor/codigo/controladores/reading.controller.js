import Reading from "../modelos/Readings.js";
import NumerologyProfile from "../modelos/NumerologyProfiles.js";
import PromptTemplate from "../modelos/PromptTemplates.js";
import { generarLectura as generarLecturaDesdeGemini } from "../servicios/lectura.service.js";

const responderConLectura = (res, lectura, status, mensaje) => {
    const datos = lectura.toObject();
    datos.respuesta = datos.respuesta_estructurada || datos.respuesta;

    return res.status(status).json({ mensaje, lectura: datos });
};

export const generarLecturaConGemini = async (req, res) => {
    try {
        const { matriz_id, plantilla_id } = req.body;
        const matriz = await NumerologyProfile.findOne({
            _id: matriz_id,
            usuario: req.usuarioId
        });

        if (!matriz) {
            return res.status(404).json({ mensaje: "Matriz numerológica no encontrada" });
        }

        const plantilla = await PromptTemplate.findOne({
            _id: plantilla_id,
            activa: true
        });

        if (!plantilla) {
            return res.status(404).json({ mensaje: "Plantilla de prompt no encontrada" });
        }

        const filtroLectura = {
            usuario: req.usuarioId,
            matriz: matriz._id,
            plantilla: plantilla._id
        };
        const lecturaExistente = await Reading.findOne(filtroLectura);

        if (lecturaExistente) {
            return responderConLectura(
                res,
                lecturaExistente,
                200,
                "Se devolvió la lectura guardada"
            );
        }

        let resultado;
        try {
            resultado = await generarLecturaDesdeGemini({
                textoPlantilla: plantilla.plantilla,
                matriz
            });
        } catch (error) {
            console.error("Error al generar la lectura con Gemini:", error.message);
            return res.status(503).json({
                mensaje: "El servicio de lecturas no está disponible"
            });
        }

        const lectura = new Reading({
            ...filtroLectura,
            prompt: resultado.prompt,
            respuesta: JSON.stringify(resultado.respuesta),
            respuesta_estructurada: resultado.respuesta,
            tipo_lectura: plantilla.tipo_lectura,
            tokens_usados: resultado.tokensUsados ?? null,
            modelo: resultado.modelo
        });

        try {
            await lectura.save();
        } catch (error) {
            if (error.code === 11000) {
                const lecturaConcurrente = await Reading.findOne(filtroLectura);
                if (lecturaConcurrente) {
                    return responderConLectura(
                        res,
                        lecturaConcurrente,
                        200,
                        "Se devolvió la lectura guardada"
                    );
                }
            }

            throw error;
        }

        return responderConLectura(
            res,
            lectura,
            201,
            "Lectura numerológica generada correctamente"
        );
    } catch (error) {
        console.error("Error al generar la lectura numerológica:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al generar la lectura numerológica"
        });
    }
};

export const crearLectura = async (req, res) => {
    try {
        const { prompt, respuesta, tipo_lectura } = req.body;
        const lectura = new Reading({
            usuario: req.usuarioId,
            prompt,
            respuesta,
            tipo_lectura
        });
        await lectura.save();

        return res.status(201).json({
            mensaje: "Lectura creada correctamente",
            lectura
        });
    } catch (error) {
        console.error("Error al crear la lectura:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al crear la lectura"
        });
    }
};

export const obtenerLecturas = async (req, res) => {
    try {
        const lecturas = await Reading.find({ usuario: req.usuarioId })
            .sort({ fecha: -1 })
            .limit(100)
            .populate("usuario", "nombre_completo email")
            .populate("plantilla")
            .populate({
                path: "matriz",
                populate: {
                    path: "usuario",
                    select: "nombre_completo email"
                }
            });

        return res.status(200).json(lecturas);
    } catch (error) {
        console.error("Error al obtener las lecturas:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener las lecturas"
        });
    }
};

export const obtenerLectura = async (req, res) => {
    try {
        const lectura = await Reading.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        })
            .populate("usuario", "nombre_completo email")
            .populate("plantilla")
            .populate({
                path: "matriz",
                populate: {
                    path: "usuario",
                    select: "nombre_completo email"
                }
            });

        if (!lectura) {
            return res.status(404).json({
                mensaje: "Lectura no encontrada"
            });
        }

        return res.status(200).json(lectura);
    } catch (error) {
        console.error("Error al obtener la lectura:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener la lectura"
        });
    }
};

export const actualizarLectura = async (req, res) => {
    try {
        const { prompt, respuesta, tipo_lectura } = req.body;
        const lectura = await Reading.findOneAndUpdate(
            { _id: req.params.id, usuario: req.usuarioId },
            { prompt, respuesta, tipo_lectura },
            { new: true, runValidators: true }
        );

        if (!lectura) {
            return res.status(404).json({
                mensaje: "Lectura no encontrada"
            });
        }

        return res.status(200).json({
            mensaje: "Lectura actualizada correctamente",
            lectura
        });
    } catch (error) {
        console.error("Error al actualizar la lectura:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al actualizar la lectura"
        });
    }
};

export const eliminarLectura = async (req, res) => {
    try {
        const lectura = await Reading.findOneAndDelete({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!lectura) {
            return res.status(404).json({
                mensaje: "Lectura no encontrada"
            });
        }

        return res.status(200).json({
            mensaje: "Lectura eliminada correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar la lectura:", error.message);
        return res.status(500).json({
            mensaje: "Error al eliminar la lectura"
        });
    }
};