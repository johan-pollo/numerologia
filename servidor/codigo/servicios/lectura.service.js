import { GEMINI_MODEL, obtenerClienteGemini } from "../configuracion/gemini.js";

const esquemaLectura = {
    type: "object",
    properties: {
        resumen: {
            type: "string",
            description: "Resumen breve y claro de la lectura numerológica."
        },
        interpretacion_numero_vida: {
            type: "string",
            description: "Interpretación reflexiva del número de vida proporcionado."
        },
        interpretacion_numero_expresion: {
            type: "string",
            description: "Interpretación reflexiva del número de expresión proporcionado."
        },
        interpretacion_numero_alma: {
            type: "string",
            description: "Interpretación reflexiva del número del alma proporcionado."
        },
        recomendacion: {
            type: "string",
            description: "Recomendación práctica y no determinista para la reflexión personal."
        }
    },
    required: [
        "resumen",
        "interpretacion_numero_vida",
        "interpretacion_numero_expresion",
        "interpretacion_numero_alma",
        "recomendacion"
    ]
};

const camposRespuesta = Object.keys(esquemaLectura.properties);

export function reemplazarNumerosPlantilla(textoPlantilla, numeros) {
    return textoPlantilla.replace(
        /\{\{\s*(numero_vida|numero_expresion|numero_alma)\s*\}\}/g,
        (_, campo) => String(numeros[campo])
    );
}

function limpiarRespuesta(respuesta) {
    if (
        !respuesta ||
        typeof respuesta !== "object" ||
        Array.isArray(respuesta) ||
        camposRespuesta.some((campo) =>
            typeof respuesta[campo] !== "string" || !respuesta[campo].trim()
        )
    ) {
        throw new Error("La respuesta de Gemini no cumple el esquema esperado");
    }

    return Object.fromEntries(
        camposRespuesta.map((campo) => [campo, respuesta[campo].trim()])
    );
}

export async function generarLectura({ textoPlantilla, matriz }) {
    const numeros = {
        numero_vida: matriz.numero_vida,
        numero_expresion: matriz.numero_expresion,
        numero_alma: matriz.numero_alma
    };
    const plantillaConNumeros = reemplazarNumerosPlantilla(textoPlantilla, numeros);
    const prompt = [
        plantillaConNumeros,
        "Datos de la matriz numerológica:",
        JSON.stringify(numeros),
        "Responde en español, con tono respetuoso y reflexivo. No presentes la numerología como ciencia ni afirmes predicciones como hechos."
    ].join("\n\n");

    const interaccion = await obtenerClienteGemini().interactions.create({
        model: GEMINI_MODEL,
        input: prompt,
        response_format: {
            type: "text",
            mime_type: "application/json",
            schema: esquemaLectura
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

    return {
        prompt,
        respuesta: limpiarRespuesta(respuesta),
        tokensUsados: interaccion.usage?.total_tokens,
        modelo: GEMINI_MODEL
    };
}
