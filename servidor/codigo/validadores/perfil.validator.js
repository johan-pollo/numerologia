import { body } from "express-validator";

const camposPerfil = ["numero_vida", "numero_expresion", "numero_alma"];
const validarNumero = (campo) =>
    body(campo)
        .custom((valor) =>
            typeof valor === "number" &&
            Number.isSafeInteger(valor) &&
            valor >= 1 &&
            valor <= 9999999999
        )
        .withMessage(`${campo} debe ser un entero positivo de máximo 10 dígitos`);

export const crearPerfilValidator = camposPerfil.map(validarNumero);

export const actualizarPerfilValidator = [
    body().custom((_, { req }) =>
        camposPerfil.some((campo) => Object.hasOwn(req.body || {}, campo))
    ).withMessage("Debes enviar al menos un número del perfil"),
    ...camposPerfil.map((campo) => validarNumero(campo).optional())
];
