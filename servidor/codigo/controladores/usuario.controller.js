import bcrypt from "bcryptjs";
import User from "../modelos/User.js";
import { generarJWT } from "../intermediarios/autenticacion.js";

export const crearUsuario = async (req, res) => {
    try {
        const { nombre_completo, email, password, fecha_nacimiento } = req.body;
        const usuario = new User({
            nombre_completo,
            email: email.toLowerCase(),
            fecha_nacimiento,
            password_hash: await bcrypt.hash(password, 10)
        });
        await usuario.save();
        req.usuarioId = usuario._id.toString();

        const usuarioRespuesta = usuario.toObject();
        delete usuarioRespuesta.password_hash;

        res.status(201).json({
            mensaje: "Usuario creado correctamente",
            usuario: usuarioRespuesta
        });
    } catch (error) {
        if (error.code === 11000 && (error.keyPattern?.email || error.keyValue?.email)) {
            return res.status(409).json({
                mensaje: "Ya existe una cuenta con ese email"
            });
        }

        console.error("Error al crear el usuario:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al crear el usuario"
        });
    }
};

export const iniciarSesion = async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await User.findOne({ email: email.toLowerCase() })
            .select("+password_hash");

        if (
            !usuario ||
            usuario.activo === false ||
            !(await bcrypt.compare(password, usuario.password_hash))
        ) {
            return res.status(401).json({
                mensaje: "Email o contraseña incorrectos"
            });
        }
        req.usuarioId = usuario._id.toString();

        const usuarioRespuesta = usuario.toObject();
        delete usuarioRespuesta.password_hash;

        res.status(200).json({
            mensaje: "Inicio de sesión correcto",
            token: generarJWT(usuario._id.toString()),
            usuario: usuarioRespuesta
        });
    } catch (error) {
        console.error("Error al iniciar sesión:", error.message);
        return res.status(500).json({ mensaje: "Error al iniciar sesión" });
    }
};

export const obtenerUsuarios = async (req, res) => {
    try {
        const usuario = await User.findById(req.usuarioId).select("-password_hash");

        return res.status(200).json(usuario ? [usuario] : []);
    } catch (error) {
        console.error("Error al obtener el usuario autenticado:", error.message);
        return res.status(500).json({ mensaje: "Error al obtener los usuarios" });
    }
};

export const obtenerUsuario = async (req, res) => {
    try {
        if (req.params.id !== req.usuarioId) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const usuario = await User.findById(req.usuarioId).select("-password_hash");

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        return res.status(200).json(usuario);
    } catch (error) {
        console.error("Error al obtener el usuario:", error.message);
        return res.status(500).json({ mensaje: "Error al obtener el usuario" });
    }
};

export const actualizarUsuario = async (req, res) => {
    try {
        if (req.params.id !== req.usuarioId) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const datosActualizados = {};
        const { nombre_completo, email, fecha_nacimiento, password } = req.body;
        if (nombre_completo !== undefined) datosActualizados.nombre_completo = nombre_completo;
        if (email !== undefined) datosActualizados.email = email.toLowerCase();
        if (fecha_nacimiento !== undefined) datosActualizados.fecha_nacimiento = fecha_nacimiento;
        if (password !== undefined) {
            datosActualizados.password_hash = await bcrypt.hash(password, 10);
        }

        const usuario = await User.findByIdAndUpdate(
            req.params.id,
            datosActualizados,
            { returnDocument: "after", runValidators: true }
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
        if (error.code === 11000 && (error.keyPattern?.email || error.keyValue?.email)) {
            return res.status(409).json({
                mensaje: "Ya existe una cuenta con ese email"
            });
        }

        console.error("Error al actualizar el usuario:", error.message);
        return res.status(error.name === "ValidationError" ? 400 : 500).json({
            mensaje: "Error al actualizar el usuario"
        });
    }
};

export const eliminarUsuario = async (req, res) => {
    try {
        if (req.params.id !== req.usuarioId) {
            return res.status(404).json({ mensaje: "Usuario no encontrado" });
        }

        const usuario = await User.findByIdAndDelete(req.usuarioId);

        if (!usuario) {
            return res.status(404).json({
                mensaje: "Usuario no encontrado"
            });
        }

        return res.status(200).json({
            mensaje: "Usuario eliminado correctamente"
        });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error.message);
        return res.status(500).json({ mensaje: "Error al eliminar el usuario" });
    }
};