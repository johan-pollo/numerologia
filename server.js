import express from "express";
import dotenv from "dotenv/config";
import conectar from "./database/cnxmongo.js";

const app = express();
console.log(process.env.MONGO_URI);

app.use(express.json());



app.listen(process.env.PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${process.env.PORT}`);
    conectar();

});