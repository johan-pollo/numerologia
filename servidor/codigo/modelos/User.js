import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    nombre_completo: {
    type: String,
    required: true,
    trim: true,
    maxlength: 120
},
    email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 254
},
    password_hash: {
    type: String,
    required: true,
    select: false
},
    fecha_nacimiento: {
    type: Date,
    required: true
},
    fecha_registro: {
    type: Date,
    default: Date.now
},
activo: {
    type: Boolean,
    default: true
}
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;