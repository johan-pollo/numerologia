import jwt from "jsonwebtoken";

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

export const autenticar = (req, res, next) => {
    const autorizacion = req.headers.authorization;
    const [tipo, token] = autorizacion?.split(" ") ?? [];

    if (tipo !== "Bearer" || !token) {
        return res.status(401).json({
            mensaje: "Token de autenticación requerido"
        });
    }

    try {
        const payload = jwt.verify(token, obtenerSecreto());
        req.usuarioId = payload.usuarioId;
        next();
    } catch {
        return res.status(401).json({
            mensaje: "Token inválido o expirado"
        });
    }
};