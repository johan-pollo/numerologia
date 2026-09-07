import mongoose from "mongoose";

const readingsSchema = new mongoose.Schema({
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
        trim: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

const Reading = mongoose.model("Reading", readingsSchema);

export default Reading;