import express from "express";
import path from "node:path";
import usuarioRoutes from "./src/routes/usuario.routes.js";
import numerologyProfileRoutes from "./src/routes/numerologyProfile.routes.js";
import readingRoutes from "./src/routes/reading.routes.js";
import compatibilityMatchRoutes from "./src/routes/compatibilityMatch.routes.js";
import auditLogRoutes from "./src/routes/auditLog.routes.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.resolve("public/index.html"));
});

app.get("/health", (req, res) => {
  res.status(200).json({ estado: "ok", servicio: "api-numerologia" });
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/perfiles", numerologyProfileRoutes);
app.use("/api/lecturas", readingRoutes);
app.use("/api/compatibilidades", compatibilityMatchRoutes);
app.use("/api/auditoria", auditLogRoutes);

app.use("/api", (req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

app.use((error, req, res, next) => {
  const status = error.status >= 400 && error.status < 500 ? error.status : 500;
  const mensaje = status === 400
    ? "Solicitud JSON inválida"
    : status < 500
      ? "Solicitud inválida"
      : "Error interno del servidor";

  res.status(status).json({ mensaje });
});

export default app;
