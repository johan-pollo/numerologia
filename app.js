import express from "express";
import path from "node:path";
import usuarioRoutes from "./src/routes/usuario.routes.js";

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

export default app;
