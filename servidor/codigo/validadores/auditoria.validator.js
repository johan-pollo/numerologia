import { body } from "express-validator";

const validarMetodo = (opcional = false) => {
    const regla = body("metodo");
    if (opcional) regla.optional();
    return regla.isString().bail().trim()
        .isIn(["GET", "POST", "PUT", "PATCH", "DELETE"])
        .withMessage("El método HTTP no es válido");
};

const validarEndpoint = (opcional = false) => {
    const regla = body("endpoint");
    if (opcional) regla.optional();
    return regla.isString().bail().trim().notEmpty()
        .isLength({ max: 2048 })
        .withMessage("El endpoint no es válido");
};

const validarEstado = (opcional = false) => {
    const regla = body("status_code");
    if (opcional) regla.optional();
    return regla.isInt({ min: 100, max: 599 })
        .withMessage("El código de estado no es válido");
};

export const crearAuditLogValidator = [
    validarEndpoint(),
    validarMetodo(),
    validarEstado()
];

export const actualizarAuditLogValidator = [
    body().custom((_, { req }) =>
        ["endpoint", "metodo", "status_code"].some((campo) =>
            Object.hasOwn(req.body || {}, campo)
        )
    ).withMessage("Debes enviar al menos un campo actualizable"),
    validarEndpoint(true),
    validarMetodo(true),
    validarEstado(true)
];
