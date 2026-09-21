import NumerologyProfile from "../models/NumerologyProfiles.js";

export const crearPerfil = async (req, res) => {
    try {
        const perfil = new NumerologyProfile(req.body);
        await perfil.save();

        res.status(201).json({
            mensaje: "Perfil numerológico creado correctamente",
            perfil
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el perfil numerológico",
            error: error.message
        });
    }
};

export const obtenerPerfiles = async (req, res) => {
    try {
        const perfiles = await NumerologyProfile.find();

        res.status(200).json(perfiles);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los perfiles numerológicos",
            error: error.message
        });
    }
};

export const obtenerPerfil = async (req, res) => {
    try {
        const perfil = await NumerologyProfile.findById(req.params.id);

        if (!perfil) {
            return res.status(404).json({
                mensaje: "Perfil numerológico no encontrado"
            });
        }

        res.status(200).json(perfil);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el perfil numerológico",
            error: error.message
        });
    }
};

export const actualizarPerfil = async (req, res) => {
    try {
        const perfil = await NumerologyProfile.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: "after" }
        );

        if (!perfil) {
            return res.status(404).json({
                mensaje: "Perfil numerológico no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Perfil numerológico actualizado correctamente",
            perfil
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el perfil numerológico",
            error: error.message
        });
    }
};

export const eliminarPerfil = async (req, res) => {
    try {
        const perfil = await NumerologyProfile.findByIdAndDelete(req.params.id);

        if (!perfil) {
            return res.status(404).json({
                mensaje: "Perfil numerológico no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Perfil numerológico eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el perfil numerológico",
            error: error.message
        });
    }
};