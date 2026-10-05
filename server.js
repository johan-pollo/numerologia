import "dotenv/config";
import app from "./app.js";
import conectar from "./src/database/cnxmongo.js";

const puerto = process.env.PORT || 3001;

if (!process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET) < 32) {
    console.error("JWT_SECRET debe tener al menos 32 bytes");
    process.exit(1);
}

try {
    await conectar();
    app.listen(puerto, () => {
        console.log(`Servidor ejecutándose en el puerto ${puerto}`);
    });
} catch (error) {
    console.error("No fue posible conectar con MongoDB:", error.message);
    process.exit(1);
}