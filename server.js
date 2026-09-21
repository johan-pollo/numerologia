import "dotenv/config";
import express from "express";
import conectar from "./src/database/cnxmongo.js";
import usuarioRoutes from "./src/routes/usuario.routes.js";
import numerologyProfileRoutes from "./src/routes/numerologyProfile.routes.js";
import readingRoutes from "./src/routes/reading.routes.js";
import compatibilityMatchRoutes from "./src/routes/compatibilityMatch.routes.js";
import auditLogRoutes from "./src/routes/auditLog.routes.js";

const app = express();

app.use(express.json());

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/perfiles", numerologyProfileRoutes);
app.use("/api/lecturas", readingRoutes);
app.use("/api/compatibilidades", compatibilityMatchRoutes);
app.use("/api/auditoria", auditLogRoutes);


conectar();

app.listen(process.env.PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${process.env.PORT}`);
});