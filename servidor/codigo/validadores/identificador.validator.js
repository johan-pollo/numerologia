import { param } from "express-validator";

export const idValidator = [
    param("id")
        .isMongoId()
        .withMessage("El ID no es válido")
];
