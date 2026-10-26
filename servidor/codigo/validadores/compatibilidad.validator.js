import { body } from "express-validator";

const validarUsuarioSegundo = [
    body("usuario_2")
        .isString()
        .withMessage("El ID del segundo usuario no es válido")
        .bail()
        .isMongoId()
        .withMessage("El ID del segundo usuario no es válido")
        .bail()
        .custom((usuarioId, { req }) => usuarioId !== req.usuarioId)
        .withMessage("No puedes comparar tu perfil contigo mismo")
];

const validarPuntaje = (opcional = false) => {
    const regla = body("puntaje");
    if (opcional) regla.optional();
    return regla.isFloat({ min: 0, max: 100 })
        .withMessage("El puntaje debe estar entre 0 y 100");
};

const validarInterpretacion = (opcional = false) => {
    const regla = body("interpretacion_ia");
    if (opcional) regla.optional();
    return regla
        .isString()
        .withMessage("La interpretación debe ser texto")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("La interpretación es obligatoria")
        .bail()
        .isLength({ max: 5000 })
        .withMessage("La interpretación no puede superar 5000 caracteres");
};

export const crearCompatibilidadValidator = [
    ...validarUsuarioSegundo,
    validarPuntaje(),
    validarInterpretacion()
];

export const actualizarCompatibilidadValidator = [
    body().custom((_, { req }) =>
        ["puntaje", "interpretacion_ia"].some((campo) =>
            Object.hasOwn(req.body || {}, campo)
        )
    ).withMessage("Debes enviar al menos un campo actualizable"),
    validarPuntaje(true),
    validarInterpretacion(true)
];

export const verificarCompatibilidadValidator = validarUsuarioSegundo;
