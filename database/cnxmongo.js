import mongoose from "mongoose";
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const conectar = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");
};

export default conectar;