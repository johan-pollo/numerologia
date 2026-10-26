import PromptTemplate from "../modelos/PromptTemplates.js";

export const crearPlantilla = async (req, res) => {
    try {
        const { nombre, plantilla, tipo_lectura } = req.body;
        const promptTemplate = await PromptTemplate.create({
            nombre,
            plantilla,
            tipo_lectura,
            creado_por: req.usuarioId
        });
        return res.status(201).json(promptTemplate);
    } catch (error) {
        console.error("Error al crear la plantilla:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al crear la plantilla"
        });
    }
};

export const obtenerPlantillas = async (req, res) => {
    try {
        const plantillas = await PromptTemplate.find({
            activa: true,
            $or: [
                { creado_por: req.usuarioId },
                { creado_por: { $exists: false } }
            ]
        }).sort({ createdAt: -1 }).limit(100);
        return res.status(200).json(plantillas);
    } catch (error) {
        console.error("Error al obtener las plantillas:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener las plantillas"
        });
    }
};

export const obtenerPlantilla = async (req, res) => {
    try {
        const plantilla = await PromptTemplate.findOne({
            _id: req.params.id,
            activa: true,
            $or: [
                { creado_por: req.usuarioId },
                { creado_por: { $exists: false } }
            ]
        });
        if (!plantilla) {
            return res.status(404).json({ mensaje: "Plantilla no encontrada" });
        }
        return res.status(200).json(plantilla);
    } catch (error) {
        console.error("Error al obtener la plantilla:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener la plantilla"
        });
    }
};

export const actualizarPlantilla = async (req, res) => {
    try {
        const { nombre, plantilla, tipo_lectura } = req.body;
        const cambios = {};
        if (nombre !== undefined) cambios.nombre = nombre;
        if (plantilla !== undefined) cambios.plantilla = plantilla;
        if (tipo_lectura !== undefined) cambios.tipo_lectura = tipo_lectura;

        const promptTemplate = await PromptTemplate.findOneAndUpdate(
            { _id: req.params.id, creado_por: req.usuarioId },
            cambios,
            { new: true, runValidators: true }
        );
        if (!promptTemplate) {
            return res.status(404).json({ mensaje: "Plantilla no encontrada" });
        }
        return res.status(200).json(promptTemplate);
    } catch (error) {
        console.error("Error al actualizar la plantilla:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al actualizar la plantilla"
        });
    }
};

export const eliminarPlantilla = async (req, res) => {
    try {
        const promptTemplate = await PromptTemplate.findOneAndDelete({
            _id: req.params.id,
            creado_por: req.usuarioId
        });
        if (!promptTemplate) {
            return res.status(404).json({ mensaje: "Plantilla no encontrada" });
        }
        return res.status(200).json({
            mensaje: "Plantilla eliminada correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar la plantilla:", error.message);
        return res.status(500).json({
            mensaje: "Error al eliminar la plantilla"
        });
    }
};
