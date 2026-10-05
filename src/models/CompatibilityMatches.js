import mongoose from "mongoose";

const compatibilityMatchesSchema = new mongoose.Schema({
    usuario_1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    usuario_2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    puntaje: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    interpretacion_ia: {
        type: String,
        required: true,
        trim: true,
        maxlength: 5000
    }
});

const CompatibilityMatch = mongoose.model(
    "CompatibilityMatch",
    compatibilityMatchesSchema
);

export default CompatibilityMatch;