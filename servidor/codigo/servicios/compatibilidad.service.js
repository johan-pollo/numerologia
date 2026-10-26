import { GEMINI_MODEL, obtenerClienteGemini } from "../configuracion/gemini.js";

const esquemaInterpretacion = {
    type: "object",
    properties: {
        interpretacion: {
            type: "string",
            description: "Interpretación respetuosa y reflexiva del puntaje de compatibilidad."
        }
    },
    required: ["interpretacion"]
};

export function calcularPuntajeCompatibilidad(perfilPrimero, perfilSegundo) {
    const campos = ["numero_vida", "numero_expresion", "numero_alma"];
    const similitudes = campos.map((campo) => {
        const primero = perfilPrimero[campo];
        const segundo = perfilSegundo[campo];
        if (
            !Number.isFinite(primero) ||
            !Number.isFinite(segundo) ||
            primero <= 0 ||
            segundo <= 0
        ) {
            throw new Error("Los perfiles deben contener números positivos válidos");
        }
        return 1 - Math.abs(primero - segundo) / Math.max(primero, segundo);
    });

    return Math.round(
        similitudes.reduce((total, valor) => total + valor, 0) / campos.length * 100
    );
}

export async function generarInterpretacionCompatibilidad({ puntaje, numeros }) {
    const interaccion = await obtenerClienteGemini().interactions.create({
        model: GEMINI_MODEL,
        input: [
            "Interpreta esta comparación numerológica en español, con tono respetuoso y no determinista.",
            "No presentes la numerología como ciencia ni afirmes predicciones como hechos.",
            JSON.stringify({ puntaje, numeros })
        ].join("\n\n"),
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: esquemaInterpretacion
        },
        store: false
    });

    if (typeof interaccion.output_text !== "string" || !interaccion.output_text.trim()) {
        throw new Error("Gemini no devolvió contenido de texto");
    }

    let respuesta;
    try {
        respuesta = JSON.parse(interaccion.output_text);
    } catch (error) {
        throw new Error("Gemini devolvió una respuesta JSON inválida", { cause: error });
    }

    if (
        typeof respuesta.interpretacion !== "string" ||
        !respuesta.interpretacion.trim() ||
        respuesta.interpretacion.trim().length > 5000
    ) {
        throw new Error("La respuesta de Gemini no cumple el esquema esperado");
    }

    return respuesta.interpretacion.trim();
}
