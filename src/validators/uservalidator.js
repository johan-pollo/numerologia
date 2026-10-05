import { body, param } from "express-validator";

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

export const actualizarUsuarioValidator = [
    body("nombre_completo")
        .notEmpty()
        .withMessage("El nombre completo es obligatorio")
        .bail()
        .isString()
        .withMessage("El nombre completo debe ser texto")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("El nombre completo es obligatorio"),

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

export const crearPerfilValidator = [
    body("usuario")
        .isString()
        .withMessage("El ID de usuario no es válido")
        .isMongoId()
        .withMessage("El ID de usuario no es válido"),
    ...["numero_vida", "numero_expresion", "numero_alma"].map((campo) =>
        body(campo)
            .custom((valor) =>
                typeof valor === "number" &&
                Number.isSafeInteger(valor) &&
                valor >= 1 &&
                valor <= 9999999999
            )
            .withMessage(`${campo} debe ser un entero positivo de máximo 10 dígitos`)
    )
];

export const actualizarPerfilValidator = [
    ...["numero_vida", "numero_expresion", "numero_alma"].map((campo) =>
        body(campo)
            .custom((valor) =>
                typeof valor === "number" &&
                Number.isSafeInteger(valor) &&
                valor >= 1 &&
                valor <= 9999999999
            )
            .withMessage(`${campo} debe ser un entero positivo de máximo 10 dígitos`)
    )
];

export const crearCompatibilidadValidator = [
    body("usuario_2")
        .isString()
        .withMessage("El ID del segundo usuario no es válido")
        .isMongoId()
        .withMessage("El ID del segundo usuario no es válido")
        .bail()
        .custom((usuarioId, { req }) => usuarioId !== req.usuarioId)
        .withMessage("No puedes comparar tu perfil contigo mismo"),
    body("puntaje")
        .isFloat({ min: 0, max: 100 })
        .withMessage("El puntaje debe estar entre 0 y 100"),
    body("interpretacion_ia")
        .isString()
        .withMessage("La interpretación debe ser texto")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("La interpretación es obligatoria")
        .bail()
        .isLength({ max: 5000 })
        .withMessage("La interpretación no puede superar 5000 caracteres")
];

export const actualizarCompatibilidadValidator = [
    body("puntaje")
        .isFloat({ min: 0, max: 100 })
        .withMessage("El puntaje debe estar entre 0 y 100"),
    body("interpretacion_ia")
        .isString()
        .withMessage("La interpretación debe ser texto")
        .bail()
        .trim()
        .notEmpty()
        .withMessage("La interpretación es obligatoria")
        .bail()
        .isLength({ max: 5000 })
        .withMessage("La interpretación no puede superar 5000 caracteres")
];

export const crearLecturaValidator = [
    body("prompt")
        .isString()
        .withMessage("El prompt es obligatorio")
        .trim()
        .notEmpty()
        .withMessage("El prompt es obligatorio"),
    body("respuesta")
        .isString()
        .withMessage("La respuesta es obligatoria")
        .trim()
        .notEmpty()
        .withMessage("La respuesta es obligatoria"),
    body("tipo_lectura")
        .isString()
        .withMessage("El tipo de lectura no es válido")
        .trim()
        .isIn(["diaria", "general", "anual"])
        .withMessage("El tipo de lectura no es válido")
];

export const idValidator = [
    param("id")
        .isMongoId()
        .withMessage("El ID no es válido")
];