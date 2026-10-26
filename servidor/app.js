import express from "express";
import path from "node:path";
import usuarioRoutes from "./codigo/rutas/usuario.routes.js";
import numerologyProfileRoutes from "./codigo/rutas/numerologyProfile.routes.js";
import readingRoutes from "./codigo/rutas/reading.routes.js";
import compatibilityMatchRoutes from "./codigo/rutas/compatibilityMatch.routes.js";
import auditLogRoutes from "./codigo/rutas/auditLog.routes.js";
import authRoutes from "./codigo/rutas/auth.routes.js";
import numerologyRoutes from "./codigo/rutas/numerology.routes.js";
import { registrarAuditoria } from "./codigo/intermediarios/auditoria.js";
import readingHistoryRoutes from "./codigo/rutas/readingHistory.routes.js";
import promptTemplateRoutes from "./codigo/rutas/promptTemplate.routes.js";

const app = express();

app.use(registrarAuditoria);
app.use(express.json({ limit: "16kb" }));
const directorioInterfaz = path.resolve("interfaz/publico");

app.use(express.static(directorioInterfaz));

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: directorioInterfaz });
});

app.get("/dashboard", (req, res) => {
  res.sendFile("index.html", { root: directorioInterfaz });
});

app.get("/health", (req, res) => {
  res.status(200).json({ estado: "ok", servicio: "api-numerologia" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usuarioRoutes);
app.use("/api/v1/numerology", numerologyRoutes);
app.use("/api/v1/readings", readingHistoryRoutes);
app.use("/api/v1/readings", readingRoutes);
app.use("/api/v1/profiles", numerologyProfileRoutes);
app.use("/api/v1/compatibility", compatibilityMatchRoutes);
app.use("/api/v1/audit", auditLogRoutes);
app.use("/api/v1/prompts", promptTemplateRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/perfiles", numerologyProfileRoutes);
app.use("/api/lecturas", readingRoutes);
app.use("/api/compatibilidades", compatibilityMatchRoutes);
app.use("/api/auditoria", auditLogRoutes);

app.use((req, res) => {
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
