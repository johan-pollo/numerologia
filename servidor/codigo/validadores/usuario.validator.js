import { body } from "express-validator";

export const crearUsuarioValidator = [
    body("nombre_completo")
        .notEmpty()
        .withMessage("El nombre completo es obligatorio")
        .bail()
        .isString()
        .withMessage("El nombre completo debe ser texto")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("El nombre completo es obligatorio")
        .bail()
        .isLength({ max: 120 })
        .withMessage("El nombre completo no puede superar 120 caracteres"),
    body("email")
        .notEmpty()
        .withMessage("El email es obligatorio")
        .bail()
        .isString()
        .withMessage("El email no es válido")
        .bail()
        .trim()
        .isEmail()
        .withMessage("El email no es válido")
        .bail()
        .isLength({ max: 254 })
        .withMessage("El email no puede superar 254 caracteres")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .bail()
        .isString()
        .withMessage("La contraseña debe ser texto")
        .bail()
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres")
        .bail()
        .custom((password) => Buffer.byteLength(password, "utf8") <= 72)
        .withMessage("La contraseña no puede superar 72 bytes"),
    body("fecha_nacimiento")
        .notEmpty()
        .withMessage("La fecha de nacimiento es obligatoria")
        .bail()
        .isString()
        .withMessage("La fecha de nacimiento no es válida")
        .bail()
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage("La fecha de nacimiento no es válida")
];

const camposUsuarioActualizables = [
    "nombre_completo",
    "email",
    "password",
    "fecha_nacimiento"
];

export const actualizarUsuarioValidator = [
    body().custom((_, { req }) =>
        camposUsuarioActualizables.some((campo) =>
            Object.hasOwn(req.body || {}, campo)
        )
    ).withMessage("Debes enviar al menos un campo actualizable"),
    body("nombre_completo")
        .optional()
        .isString()
        .withMessage("El nombre completo debe ser texto")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("El nombre completo es obligatorio")
        .bail()
        .isLength({ max: 120 })
        .withMessage("El nombre completo no puede superar 120 caracteres"),
    body("email")
        .optional()
        .isString()
        .withMessage("El email no es válido")
        .bail()
        .trim()
        .isEmail()
        .withMessage("El email no es válido")
        .bail()
        .isLength({ max: 254 })
        .withMessage("El email no puede superar 254 caracteres")
        .normalizeEmail(),
    body("password")
        .optional()
        .isString()
        .withMessage("La contraseña debe ser texto")
        .bail()
        .isLength({ min: 8 })
        .withMessage("La contraseña debe tener al menos 8 caracteres")
        .bail()
        .custom((password) => Buffer.byteLength(password, "utf8") <= 72)
        .withMessage("La contraseña no puede superar 72 bytes"),
    body("fecha_nacimiento")
        .optional()
        .isString()
        .withMessage("La fecha de nacimiento no es válida")
        .bail()
        .isISO8601({ strict: true, strictSeparator: true })
        .withMessage("La fecha de nacimiento no es válida")
];

export const loginValidator = [
    body("email")
        .isString()
        .withMessage("El email no es válido")
        .trim()
        .isEmail()
        .withMessage("El email no es válido")
        .bail()
        .isLength({ max: 254 })
        .withMessage("El email no puede superar 254 caracteres")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .bail()
        .isString()
        .withMessage("La contraseña debe ser texto")
        .bail()
        .custom((password) => Buffer.byteLength(password, "utf8") <= 72)
        .withMessage("La contraseña no puede superar 72 bytes")
];
