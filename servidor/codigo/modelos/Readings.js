import mongoose from "mongoose";

const respuestaEstructuradaSchema = new mongoose.Schema({
    resumen: {
        type: String,
        required: true,
        trim: true
    },
    interpretacion_numero_vida: {
        type: String,
        required: true,
        trim: true
    },
    interpretacion_numero_expresion: {
        type: String,
        required: true,
        trim: true
    },
    interpretacion_numero_alma: {
        type: String,
        required: true,
        trim: true
    },
    recomendacion: {
        type: String,
        required: true,
        trim: true
    }
}, { _id: false });

const readingsSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    matriz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NumerologyProfile"
    },
    plantilla: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PromptTemplate"
    },
    prompt: {
        type: String,
        required: true,
        trim: true
    },
    respuesta: {
        type: String,
        required: true,
        trim: true
    },
    respuesta_estructurada: {
        type: respuestaEstructuradaSchema
    },
    tipo_lectura: {
        type: String,
        required: true,
        trim: true,
        enum: ["diaria", "general", "anual"]
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    modelo: {
        type: String,
        trim: true
    },
    tokens_usados: {
        type: Number,
        min: 0,
        validate: Number.isInteger
    }
}, { timestamps: true });

readingsSchema.index(
    { matriz: 1, plantilla: 1 },
    {
        unique: true,
        partialFilterExpression: {
            matriz: { $type: "objectId" },
            plantilla: { $type: "objectId" }
        }
    }
);

const Reading = mongoose.model("Reading", readingsSchema);

export default Reading;