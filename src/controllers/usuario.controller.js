import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generarJWT } from "../middlewares/autenticacion.js";

export const crearUsuario = async (req, res) => {
    try {
        const { password, password_hash: hashEnviado, ...datosUsuario } = req.body;
        const usuario = new User({
            ...datosUsuario,
            password_hash: await bcrypt.hash(password, 10)
        });
        await usuario.save();

        const usuarioRespuesta = usuario.toObject();
        delete usuarioRespuesta.password_hash;

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario: usuarioRespuesta
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al crear el usuario",
            error: error.message
        });
    }
};

export const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await User.findOne({ email });

        if (!usuario || !(await bcrypt.compare(password, usuario.password_hash))) {
            return res.status(401).json({
                mensaje: "Email o contraseña incorrectos"
            });
        }

        const usuarioRespuesta = usuario.toObject();
        delete usuarioRespuesta.password_hash;

        res.status(200).json({
            mensaje: "Inicio de sesión correcto",
            token: generarJWT(usuario._id.toString()),
            usuario: usuarioRespuesta
        });
    } catch (error) {
        res.status(500).json({
            mensaje: "Error al iniciar sesión",
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
        const { password, password_hash: hashEnviado, ...datosUsuario } = req.body;
        const datosActualizados = { ...datosUsuario };

        if (password) {
            datosActualizados.password_hash = await bcrypt.hash(password, 10);
        }

        const usuario = await User.findByIdAndUpdate(
            req.params.id,
            datosActualizados,
            { returnDocument: "after" }
        );

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        const usuarioRespuesta = usuario.toObject();
        delete usuarioRespuesta.password_hash;

        res.status(200).json({
            mensaje: "Usuario actualizado correctamente",
            usuario: usuarioRespuesta
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