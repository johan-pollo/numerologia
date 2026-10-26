import NumerologyProfile from "../modelos/NumerologyProfiles.js";
import User from "../modelos/User.js";
import { calcularNumerosPrincipales } from "../servicios/numerology.js";

export const calcularPerfil = async (req, res) => {
    try {
        const usuario = await User.findById(req.usuarioId).select(
            "nombre_completo fecha_nacimiento"
        );

        if (!usuario) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const numeros = calcularNumerosPrincipales(
            usuario.nombre_completo,
            usuario.fecha_nacimiento
        );
        let perfil = await NumerologyProfile.findOne({ usuario: usuario._id })
            .sort({ _id: -1 });
        const creado = !perfil;

        if (perfil) {
            Object.assign(perfil, numeros);
        } else {
            perfil = new NumerologyProfile({ usuario: usuario._id, ...numeros });
        }

        await perfil.save();

        return res.status(creado ? 201 : 200).json({
            mensaje: creado
                ? "Perfil numerológico calculado correctamente"
                : "Perfil numerológico actualizado correctamente",
            perfil
        });
    } catch (error) {
        console.error("Error al calcular el perfil numerológico:", error.message);
        return res.status(error instanceof TypeError ? 400 : 500).json({
            mensaje: error instanceof TypeError
                ? error.message
                : "Error al calcular el perfil numerológico"
        });
    }
};

export const obtenerPerfilAutenticado = async (req, res) => {
    try {
        const perfil = await NumerologyProfile.findOne({ usuario: req.usuarioId })
            .sort({ _id: -1 });

        if (!perfil) {
            return res.status(404).json({
                mensaje: "El usuario todavía no tiene un perfil numerológico"
            });
        }

        return res.status(200).json(perfil);
    } catch (error) {
        console.error("Error al obtener el perfil numerológico:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener el perfil numerológico"
        });
    }
};

export const crearPerfil = async (req, res) => {
    try {
        const { numero_vida, numero_expresion, numero_alma } = req.body;
        let perfil = await NumerologyProfile.findOne({ usuario: req.usuarioId })
            .sort({ _id: -1 });
        const creado = !perfil;

        if (perfil) {
            Object.assign(perfil, { numero_vida, numero_expresion, numero_alma });
        } else {
            perfil = new NumerologyProfile({
                usuario: req.usuarioId,
                numero_vida,
                numero_expresion,
                numero_alma
            });
        }

        await perfil.save();

        return res.status(creado ? 201 : 200).json({
            mensaje: creado
                ? "Perfil numerológico creado correctamente"
                : "Perfil numerológico actualizado correctamente",
            perfil
        });
    } catch (error) {
        console.error("Error al crear el perfil numerológico:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al crear el perfil numerológico"
        });
    }
};

export const obtenerPerfiles = async (req, res) => {
    try {
        const perfiles = await NumerologyProfile.find({ usuario: req.usuarioId })
            .sort({ _id: 1 })
            .limit(100);

        return res.status(200).json(perfiles);
    } catch (error) {
        console.error("Error al obtener los perfiles numerológicos:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener los perfiles numerológicos"
        });
    }
};

export const obtenerPerfil = async (req, res) => {
    try {
        const perfil = await NumerologyProfile.findOne({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!perfil) {
            return res.status(404).json({
                mensaje: "Perfil numerológico no encontrado"
            });
        }

        return res.status(200).json(perfil);
    } catch (error) {
        console.error("Error al obtener el perfil numerológico:", error.message);
        return res.status(500).json({
            mensaje: "Error al obtener el perfil numerológico"
        });
    }
};

export const actualizarPerfil = async (req, res) => {
    try {
        const { numero_vida, numero_expresion, numero_alma } = req.body;
        const perfil = await NumerologyProfile.findOneAndUpdate(
            { _id: req.params.id, usuario: req.usuarioId },
            { numero_vida, numero_expresion, numero_alma },
            { returnDocument: "after", runValidators: true }
        );

        if (!perfil) {
            return res.status(404).json({
                mensaje: "Perfil numerológico no encontrado"
            });
        }

        return res.status(200).json({
            mensaje: "Perfil numerológico actualizado correctamente",
            perfil
        });
    } catch (error) {
        console.error("Error al actualizar el perfil numerológico:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al actualizar el perfil numerológico"
        });
    }
};

export const eliminarPerfil = async (req, res) => {
    try {
        const perfil = await NumerologyProfile.findOneAndDelete({
            _id: req.params.id,
            usuario: req.usuarioId
        });

        if (!perfil) {
            return res.status(404).json({
                mensaje: "Perfil numerológico no encontrado"
            });
        }

        return res.status(200).json({
            mensaje: "Perfil numerológico eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar el perfil numerológico:", error.message);
        return res.status(500).json({
            mensaje: "Error al eliminar el perfil numerológico"
        });
    }
};