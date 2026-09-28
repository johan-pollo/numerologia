import Reading from "../models/Readings.js";

export const crearLectura = async (req, res) => {
    try {
        const lectura = new Reading(req.body);
        await lectura.save();

        res.status(201).json({
            mensaje: "Lectura creada correctamente",
            lectura
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear la lectura"
        });
    }
};

export const obtenerLecturas = async (req, res) => {
    try {
        const lecturas = await Reading.find();

        res.status(200).json(lecturas);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener las lecturas"
        });
    }
};

export const obtenerLectura = async (req, res) => {
    try {
        const lectura = await Reading.findById(req.params.id);

        if (!lectura) {
            return res.status(404).json({
                mensaje: "Lectura no encontrada"
            });
        }

        res.status(200).json(lectura);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener la lectura"
        });
    }
};

export const actualizarLectura = async (req, res) => {
    try {
        const lectura = await Reading.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!lectura) {
            return res.status(404).json({
                mensaje: "Lectura no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Lectura actualizada correctamente",
            lectura
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar la lectura"
        });
    }
};

export const eliminarLectura = async (req, res) => {
    try {
        const lectura = await Reading.findByIdAndDelete(req.params.id);

        if (!lectura) {
            return res.status(404).json({
                mensaje: "Lectura no encontrada"
            });
        }

        res.status(200).json({
            mensaje: "Lectura eliminada correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar la lectura"
        });
    }
};