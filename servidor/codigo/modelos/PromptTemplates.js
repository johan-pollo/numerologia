import mongoose from "mongoose";

const promptTemplatesSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        maxlength: 120
    },
    plantilla: {
        type: String,
        required: true,
        trim: true,
        maxlength: 10000
    },
    tipo_lectura: {
        type: String,
        required: true,
        trim: true,
        enum: ["diaria", "general", "anual"]
    },
    activa: {
        type: Boolean,
        default: true
    },
    creado_por: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

const PromptTemplate = mongoose.model("PromptTemplate", promptTemplatesSchema);

export default PromptTemplate;
