import { body } from "express-validator";

const camposLectura = ["prompt", "respuesta", "tipo_lectura"];
const validarTexto = (campo) =>
    body(campo)
        .isString()
        .withMessage(`${campo} debe ser texto`)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(`${campo} es obligatorio`);

export const crearLecturaValidator = [
    validarTexto("prompt"),
    validarTexto("respuesta"),
    body("tipo_lectura")
        .isString()
        .withMessage("El tipo de lectura no es válido")
        .bail()
        .trim()
        .isIn(["diaria", "general", "anual"])
        .withMessage("El tipo de lectura no es válido")
];

export const actualizarLecturaValidator = [
    body().custom((_, { req }) =>
        camposLectura.some((campo) => Object.hasOwn(req.body || {}, campo))
    ).withMessage("Debes enviar al menos un campo actualizable"),
    body("prompt").optional().isString().bail().trim().notEmpty()
        .withMessage("El prompt es obligatorio"),
    body("respuesta").optional().isString().bail().trim().notEmpty()
        .withMessage("La respuesta es obligatoria"),
    body("tipo_lectura").optional().isString().bail().trim()
        .isIn(["diaria", "general", "anual"])
        .withMessage("El tipo de lectura no es válido")
];

export const crearLecturaConGeminiValidator = [
    body("matriz_id")
        .isString()
        .withMessage("El ID de la matriz no es válido")
        .bail()
        .isMongoId()
        .withMessage("El ID de la matriz no es válido"),
    body("plantilla_id")
        .isString()
        .withMessage("El ID de la plantilla no es válido")
        .bail()
        .isMongoId()
        .withMessage("El ID de la plantilla no es válido")
];
