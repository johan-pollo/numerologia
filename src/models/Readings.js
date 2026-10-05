import mongoose from "mongoose";

const readingsSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
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
    tipo_lectura: {
        type: String,
        required: true,
        trim: true,
        enum: ["diaria", "general", "anual"]
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

const Reading = mongoose.model("Reading", readingsSchema);

export default Reading;