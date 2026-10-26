import jwt from "jsonwebtoken";
import User from "../modelos/User.js";

const obtenerSecreto = () => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET no está configurado");
    }

    return process.env.JWT_SECRET;
};

export const generarJWT = (usuarioId) => jwt.sign(
    { usuarioId },
    obtenerSecreto(),
    { expiresIn: "2h" }
);

export const autenticar = async (req, res, next) => {
    const autorizacion = req.headers.authorization;
    const [tipo, token] = autorizacion?.split(" ") ?? [];

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({
            mensaje: "Token de autenticación requerido"
        });
    }

    let payload;
    try {
        payload = jwt.verify(token, obtenerSecreto());
    } catch {
        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });
    }

    if (!payload || typeof payload !== "object" || typeof payload.usuarioId !== "string") {
        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });
    }

    try {
        const usuario = await User.findById(payload.usuarioId).select("_id activo");
        if (!usuario || usuario.activo === false) {
            return res.status(401).json({
                mensaje: "Token inválido o usuario inactivo"
            });
        }

        req.usuario = usuario;
        req.usuarioId = usuario._id.toString();
        next();
    } catch (error) {
        console.error("No fue posible validar el usuario autenticado:", error.message);
        return res.status(500).json({
            mensaje: "No fue posible validar la autenticación"
        });
    }
};