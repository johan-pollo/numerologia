import mongoose from "mongoose";

const conectar = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado correctamente");
};

export default conectar;