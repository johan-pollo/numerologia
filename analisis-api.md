# Análisis de la API de Numerología

**Base del análisis:** código actual del repositorio, pruebas `npm test` y comprobaciones HTTP locales sin escritura en MongoDB. Las predicciones están separadas de las observaciones. No se modificó el código de la API.

## Bloque 1 — El viaje de una petición

### Reto 1.1 — El mapa

**Hallazgo:** en el repositorio actual no existe una petición GET que use `populate()`. Ningún controlador contiene esa llamada. Por eso no es posible trazar honestamente el viaje solicitado de un documento poblado. La relación sí está declarada en el modelo de perfiles, pero las consultas actuales devuelven el ObjectId: [src/models/NumerologyProfiles.js](src/models/NumerologyProfiles.js#L3-L8) y [src/controllers/numerologyProfile.controller.js](src/controllers/numerologyProfile.controller.js#L31-L45).

Como recorrido más cercano, usamos `GET /api/perfiles/:id` con un ID válido y un JWT. No tiene `populate`; se indica qué ocurriría en la versión actual:

| Parada, en orden | Archivo/capa | Qué hace y qué entrega |
|---|---|---|
| 1. Postman | Cliente HTTP | Envía `GET /api/perfiles/ID` y `Authorization: Bearer TOKEN`. |
| 2. Socket HTTP | Node.js / sistema operativo | Entrega la conexión entrante al servidor ligado al puerto configurado por `app.listen`. |
| 3. Servidor | `server.js` | `app.listen` acepta la petición y la pasa a Express. |
| 4. Parser y aplicación | `app.js` | Express recorre middleware en orden. `express.json()` está antes de las rutas, aunque no transforma un GET sin cuerpo JSON. |
| 5. Prefijo | `app.js` | El prefijo `/api/perfiles` entrega el resto de la ruta (`/:id`) al router de perfiles. |
| 6. Autenticación | `src/routes/numerologyProfile.routes.js`, `src/middlewares/autenticacion.js` | `router.use(autenticar)` comprueba el Bearer JWT. Si es válido, ejecuta `next()` y deja continuar; si no, responde 401. |
| 7. Coincidencia y validación | `src/routes/numerologyProfile.routes.js`, `src/validators/uservalidator.js` | Coincide `GET /:id`; `idValidator` comprueba formato MongoId y `validarCampos` recoge fallos. |
