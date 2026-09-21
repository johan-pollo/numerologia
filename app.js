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
  res.redirect("/dashboard.html");
});

app.get("/dashboard", (req, res) => {
  res.sendFile(path.resolve("public/dashboard.html"));
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/perfiles", numerologyProfileRoutes);
app.use("/api/lecturas", readingRoutes);
app.use("/api/compatibilidades", compatibilityMatchRoutes);
app.use("/api/auditoria", auditLogRoutes);

export default app;
