import Reading from "../models/Readings.js";

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
            .limit(100);

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