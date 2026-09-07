import User from "../models/User.js";

export const crearUsuario = async (req, res) => {
    try {
        const usuario = new User(req.body);
        await usuario.save();

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el usuario",
            error: error.message
        });
    }
};

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuarios = await User.find();

        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener los usuarios",
            error: error.message
        });
    }
};

export const obtenerUsuario = async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al obtener el usuario",
            error: error.message
        });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        const usuario = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Usuario actualizado correctamente",
            usuario
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        const usuario = await User.findByIdAndDelete(req.params.id);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Usuario eliminado correctamente"
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al eliminar el usuario",
            error: error.message
        });
    }
};