import { body } from "express-validator";

const campos = ["nombre", "plantilla", "tipo_lectura"];

const validarNombre = (opcional = false) => {
    const regla = body("nombre");
    if (opcional) regla.optional();
    return regla.isString().bail().trim().notEmpty()
        .isLength({ max: 120 })
        .withMessage("El nombre de plantilla no es válido");
};

const validarPlantilla = (opcional = false) => {
    const regla = body("plantilla");
    if (opcional) regla.optional();
    return regla.isString().bail().trim().notEmpty()
        .isLength({ max: 10000 })
        .withMessage("El texto de plantilla no es válido");
};

const validarTipo = (opcional = false) => {
    const regla = body("tipo_lectura");
    if (opcional) regla.optional();
    return regla.isString().bail().trim()
        .isIn(["diaria", "general", "anual"])
        .withMessage("El tipo de lectura no es válido");
};

export const crearPlantillaValidator = [
    validarNombre(),
    validarPlantilla(),
    validarTipo()
];

export const actualizarPlantillaValidator = [
    body().custom((_, { req }) =>
        campos.some((campo) => Object.hasOwn(req.body || {}, campo))
    ).withMessage("Debes enviar al menos un campo actualizable"),
    validarNombre(true),
    validarPlantilla(true),
    validarTipo(true)
];
