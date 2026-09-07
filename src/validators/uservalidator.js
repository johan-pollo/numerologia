import { body, param } from "express-validator";

export const crearUsuarioValidator = [
    body("nombre_completo")
        .notEmpty()
        .withMessage("El nombre completo es obligatorio"),

    body("email")
        .notEmpty()
        .withMessage("El email es obligatorio"),

    body("password_hash")
        .notEmpty()
        .withMessage("La contraseña es obligatoria"),

    body("fecha_nacimiento")
        .notEmpty()
        .withMessage("La fecha de nacimiento es obligatoria")
];

export const actualizarUsuarioValidator = [
    body("nombre_completo")
        .notEmpty()
        .withMessage("El nombre completo es obligatorio"),

    body("email")
        .notEmpty()
        .withMessage("El email es obligatorio"),

    body("password_hash")
        .notEmpty()
        .withMessage("La contraseña es obligatoria"),

    body("fecha_nacimiento")
        .notEmpty()
        .withMessage("La fecha de nacimiento es obligatoria")
];

export const idValidator = [
    param("id")
        .isMongoId()
        .withMessage("El ID no es válido")
];