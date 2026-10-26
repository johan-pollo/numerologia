import test from "node:test";
import assert from "node:assert/strict";
import { calcularPuntajeCompatibilidad } from "../codigo/servicios/compatibilidad.service.js";
import { reemplazarNumerosPlantilla } from "../codigo/servicios/lectura.service.js";

test("El puntaje de compatibilidad es 100 cuando los tres números coinciden", () => {
    const perfil = {
        numero_vida: 11,
        numero_expresion: 4,
        numero_alma: 22
    };

    assert.equal(calcularPuntajeCompatibilidad(perfil, perfil), 100);
});

test("El puntaje promedia la distancia relativa de los tres números", () => {
    const perfilPrimero = {
        numero_vida: 1,
        numero_expresion: 3,
        numero_alma: 9
    };
    const perfilSegundo = {
        numero_vida: 1,
        numero_expresion: 6,
        numero_alma: 3
    };

    assert.equal(calcularPuntajeCompatibilidad(perfilPrimero, perfilSegundo), 61);
});

test("La plantilla reemplaza cada marcador numérico", () => {
    const plantilla = "{{numero_vida}} / {{ numero_expresion }} / {{numero_alma}}";
    const numeros = {
        numero_vida: 11,
        numero_expresion: 5,
        numero_alma: 33
    };

    assert.equal(reemplazarNumerosPlantilla(plantilla, numeros), "11 / 5 / 33");
});
