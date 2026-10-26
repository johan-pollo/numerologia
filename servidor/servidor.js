import "dotenv/config";
import app from "./app.js";
import {
    disconnectFromMongoDB
} from "./codigo/base_datos/cnxmongo.js";
import { conectarDB } from "./codigo/configuracion/db.js";

const puerto = process.env.PORT || 3001;

if (!process.env.JWT_SECRET || Buffer.byteLength(process.env.JWT_SECRET) < 32) {
    console.error("JWT_SECRET debe tener al menos 32 bytes");
    process.exit(1);
}

try {
    await conectarDB();
    const servidor = app.listen(puerto, () => {
        console.log(`Servidor ejecutándose en el puerto ${puerto}`);
    });

    let cerrando = false;
    const cerrarAplicacion = (senal) => {
        if (cerrando) return;
        cerrando = true;
        console.log(`Cerrando servidor por ${senal}...`);

        servidor.close(async (error) => {
            try {
                await disconnectFromMongoDB();
                if (error) throw error;
                process.exit(0);
            } catch (error) {
                console.error("No fue posible cerrar la conexión con MongoDB:", error.message);
                process.exit(1);
            }
        });
    };

    process.once("SIGINT", () => cerrarAplicacion("SIGINT"));
    process.once("SIGTERM", () => cerrarAplicacion("SIGTERM"));
} catch (error) {
    console.error("No fue posible conectar con MongoDB:", error.message);
    process.exit(1);
}