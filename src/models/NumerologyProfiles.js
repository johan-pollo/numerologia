import mongoose from "mongoose";

const numerologyProfileSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    numero_vida: {
        type: Number,
        required: true
    },
    numero_expresion: {
        type: Number,
        required: true
    },
    numero_alma: {
        type: Number,
        required: true
    }
});

const NumerologyProfile = mongoose.model(
    "NumerologyProfile",
    numerologyProfileSchema
);

export default NumerologyProfile;