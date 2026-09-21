import "dotenv/config";
import app from "./app.js";
import conectar from "./src/database/cnxmongo.js";

conectar();

app.listen(process.env.PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${process.env.PORT}`);
});