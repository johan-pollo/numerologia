import mongoose from "mongoose";

const conectar = async () => {
    const uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/numerologia";

    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        retryWrites: true,
        w: "majority"
    });

    console.log("Conectado a MongoDB");
    return mongoose.connection;
};

export default conectar;