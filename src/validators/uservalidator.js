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
        .withMessage("El email no es válido"),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .bail()
        .isString()
        .withMessage("La contraseña debe ser texto"),

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
        .withMessage("El email no es válido"),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .bail()
        .isString()
        .withMessage("La contraseña debe ser texto"),

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
        .withMessage("El email no es válido"),

    body("password")
        .notEmpty()
        .withMessage("La contraseña es obligatoria")
        .bail()
        .isString()
        .withMessage("La contraseña debe ser texto")
];

export const crearPerfilValidator = [
    body("usuario")
        .isString()
        .withMessage("El ID de usuario no es válido")
        .isMongoId()
        .withMessage("El ID de usuario no es válido"),
    ...["numero_vida", "numero_expresion", "numero_alma"].map((campo) =>
        body(campo)
            .custom((valor) => typeof valor === "number" && Number.isFinite(valor))
            .withMessage(`${campo} debe ser un número`)
    )
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