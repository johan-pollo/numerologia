import "dotenv/config";
import app from "./app.js";
import conectar from "./src/database/cnxmongo.js";

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await conectar();
        app.listen(PORT, () => {
            console.log(`Servidor ejecutándose en el puerto ${PORT}`);
        });
    } catch (error) {
        console.error("Error al iniciar el servidor:", error.message);
        process.exit(1);
    }
};

iniciarServidor();