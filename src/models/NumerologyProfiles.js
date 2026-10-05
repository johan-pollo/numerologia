import mongoose from "mongoose";

const numerologyProfileSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    numero_vida: {
        type: Number,
        required: true,
        min: 1,
        max: 9999999999,
        validate: Number.isInteger
    },
    numero_expresion: {
        type: Number,
        required: true,
        min: 1,
        max: 9999999999,
        validate: Number.isInteger
    },
    numero_alma: {
        type: Number,
        required: true,
        min: 1,
        max: 9999999999,
        validate: Number.isInteger
    }
});

const NumerologyProfile = mongoose.model(
    "NumerologyProfile",
    numerologyProfileSchema
);

export default NumerologyProfile;