import { GoogleGenAI } from "@google/genai";

export const GEMINI_MODEL = "gemini-3.8-flash";

let cliente;

export function obtenerClienteGemini() {
    if (!process.env.GEMINI_API_KEY?.trim()) {
        throw new Error("GEMINI_API_KEY no está configurada");
    }

    if (!cliente) {
        cliente = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY.trim() });
    }

    return cliente;
}
