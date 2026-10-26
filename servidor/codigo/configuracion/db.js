import { connectToMongoDB } from "../base_datos/cnxmongo.js";

export async function conectarDB() {
    try {
        await connectToMongoDB();
    } catch (error) {
        console.error("No fue posible conectar con MongoDB:", error.message);
        process.exit(1);
    }
}
