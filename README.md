# Proyecto de numerología

## ¿Qué hace?

Es una aplicación web para registrar usuarios, iniciar sesión, calcular un perfil numerológico y guardar lecturas. La página se abre en el navegador; el servidor procesa las solicitudes, valida los datos y consulta MongoDB Atlas. La generación de lecturas también puede solicitar una interpretación estructurada a Gemini.

## Cómo se relacionan las partes

La arquitectura es una aplicación monolítica organizada por capas:

1. **Interfaz:** el navegador muestra la página estática de numerología y envía solicitudes HTTP a la API.
2. **Servidor Express:** recibe las solicitudes, autentica al usuario, valida entradas y ejecuta la lógica de cada función.
3. **Servicios y modelos:** los servicios realizan cálculos o llamadas a Gemini; los modelos Mongoose representan los documentos guardados.
4. **MongoDB Atlas:** conserva usuarios, perfiles, lecturas, compatibilidades y auditoría. La URI se toma de `MONGO_URI`.

La API responde en JSON. Las rutas protegidas requieren un token JWT de tipo Bearer.

## Carpetas y archivos

```text
.
├── index.js
├── interfaz/
│   └── publico/
├── servidor/
│   ├── codigo/
│   │   ├── base_datos/
│   │   ├── configuracion/
│   │   ├── controladores/
│   │   ├── intermediarios/
│   │   ├── modelos/
│   │   ├── rutas/
│   │   ├── servicios/
│   │   └── validadores/
│   └── pruebas/
├── Dockerfile
├── .dockerignore
├── documentacion/
└── package.json
```

### Interfaz

- `interfaz/publico/index.html`: página principal; incluye formularios para iniciar sesión, registrarse y calcular/consultar el perfil.
- `interfaz/publico/dashboard.html`: página alternativa del dashboard.
- `interfaz/publico/favicon.svg`: icono de la página.
- `interfaz/publico/icons.svg`: colección de iconos SVG.

Express sirve estos archivos en `/` y conserva `/dashboard` como dirección alternativa.

### Servidor

- `index.js`: punto de entrada en la raíz; carga dotenv e inicia el servidor en español.
- `servidor/servidor.js`: comprueba el secreto JWT, conecta con MongoDB y luego abre el servidor HTTP.
- `servidor/app.js`: configura Express, sirve la interfaz, registra las rutas y define respuestas de error.
- `Dockerfile` y `.dockerignore`: empaquetan el backend sin incluir `.env` ni `node_modules`.

#### Código (`servidor/codigo/`)

- `configuracion/gemini.js`: mantiene un único cliente del SDK de Google y define el modelo Gemini.
- `base_datos/cnxmongo.js`: conexión activa de Mongoose, URI desde `MONGO_URI` y nombre de base desde `MONGODB_DB_NAME` (por defecto, `numerologia`). El nombre configurado debe coincidir con la base que quieras usar en Atlas.
- `configuracion/db.js`: conecta la aplicación a MongoDB y gestiona el fallo de inicio.
- `intermediarios/autenticacion.js`: crea y valida tokens JWT.
- `intermediarios/auditoria.js`: registra solicitudes de usuarios autenticados.
- `intermediarios/validarcampos.js`: transforma errores de `express-validator` en respuestas HTTP 400.
- `validadores/`: reglas separadas por recurso para usuarios, perfiles, lecturas, compatibilidades, plantillas y auditoría; incluye validador de IDs.
- `modelos/User.js`: estructura del usuario y sus credenciales cifradas.
- `modelos/NumerologyProfiles.js`: perfil de usuario con número de vida, expresión y alma.
- `modelos/Readings.js`: lectura guardada, respuesta estructurada y referencias a matriz y plantilla.
- `modelos/PromptTemplates.js`: plantillas de lectura mantenidas en MongoDB; el cliente no envía el texto de la plantilla.
- `modelos/CompatibilityMatches.js`: compatibilidad entre dos usuarios y su interpretación.
- `modelos/AuditLogs.js`: estructura de los eventos de auditoría.
- `controladores/usuario.controller.js`: registro, inicio de sesión y operaciones de usuario.
- `controladores/numerologyProfile.controller.js`: calcula, consulta y actualiza perfiles numerológicos.
- `controladores/reading.controller.js`: crea y consulta lecturas; comprueba la caché y coordina su generación con Gemini.
- `controladores/compatibilityMatch.controller.js`: operaciones para compatibilidades.
- `controladores/auditLog.controller.js`: CRUD autenticado de registros de auditoría.
- `controladores/promptTemplate.controller.js`: CRUD de plantillas propias y consulta de plantillas disponibles.
- `rutas/auth.routes.js`: registro e inicio de sesión bajo `/api/v1/auth`.
- `rutas/numerology.routes.js`: cálculo y consulta del perfil bajo `/api/v1/numerology`.
- `rutas/reading.routes.js`: CRUD de lecturas y generación con Gemini bajo `/api/v1/readings`.
- `rutas/readingHistory.routes.js`: historial de lecturas bajo `/api/v1/readings/history`.
- `rutas/usuario.routes.js`: rutas CRUD de usuarios.
- `rutas/numerologyProfile.routes.js`: rutas CRUD de perfiles.
- `rutas/compatibilityMatch.routes.js`: rutas de compatibilidad.
- `rutas/auditLog.routes.js`: CRUD autenticado de registros de auditoría.
- `rutas/promptTemplate.routes.js`: CRUD autenticado de plantillas de prompt.
- `servicios/numerology.js`: cálculo pitagórico de los números principales.
- `servicios/lectura.service.js`: prepara el prompt, solicita JSON estructurado a Gemini y valida/limpia el resultado; no accede a Express.
- `servicios/compatibilidad.service.js`: solicita a Gemini la interpretación estructurada de una comparación.

#### Pruebas (`servidor/pruebas/`)

- `app.test.js`: verifica rutas, autenticación, validaciones y respuestas HTTP.
- `numerology.test.js`: comprueba los cálculos numerológicos.

### Documentación y configuración de la raíz

- `documentacion/README_API.md`: instalación, configuración y referencia de endpoints.
- `documentacion/analisis-api.md`: análisis previo de la API.
- `documentacion/Proyecto Numerología - API - FASE 1 PRIMER ENTREGA - GALVIS BUITRAGO & GONZALEZ DIAZ.txt`: documento de entrega del proyecto.
- `package.json`: dependencias y comandos npm.
- `package-lock.json`: versiones exactas instaladas por npm.
- `.env.example`: nombres de variables que debes configurar, sin credenciales.
- `.env`: configuración privada local; está excluido de Git y no debe compartirse.
- `.gitignore`: evita incluir `.env` en Git.

`node_modules/` contiene dependencias instaladas y `dist/` es salida generada; no son código fuente.

## Tecnologías

- **Node.js y JavaScript ESM:** ejecución del servidor y módulos.
- **Express 5:** API HTTP y entrega de archivos estáticos.
- **MongoDB Atlas y Mongoose 9:** almacenamiento y validación de documentos.
- **dotenv:** carga de variables de entorno.
- **@google/genai:** integración con Gemini mediante salida JSON estructurada.
- **express-validator:** validación de solicitudes.
- **jsonwebtoken y bcryptjs:** autenticación y protección de contraseñas.
- **HTML, CSS y JavaScript del navegador:** interfaz web estática.
- **Node.js Test Runner:** pruebas automatizadas.
- **Docker:** ejecución del backend en un contenedor Node.js 22.

## Instalación y ejecución

Se necesita Node.js 20.19 o posterior. Desde la carpeta raíz:

```powershell
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
npm start
```

En `.env`, configura `MONGO_URI` y un `JWT_SECRET` de al menos 32 bytes; el servidor no inicia sin este último. `GEMINI_API_KEY` solo hace falta para generar lecturas con Gemini. `MONGODB_DB_NAME` debe coincidir con la base deseada en Atlas. No pegues valores privados en README, ejemplos, repositorios ni mensajes. El servidor carga `.env` antes de conectar.

Pruebas:

```powershell
npm test
```

La página se abre en `http://localhost:3001/` y la comprobación de estado en `http://localhost:3001/health`.

## Uso básico

1. Registra un usuario e inicia sesión por `/api/v1/auth/register` y `/api/v1/auth/login`.
2. Envía el token recibido como `Authorization: Bearer <token>`.
3. Calcula el perfil con `POST /api/v1/numerology/calculate`.
4. Consulta el perfil con `GET /api/v1/numerology/profile`.
5. Crea una plantilla en `POST /api/v1/prompts` y genera una lectura por `POST /api/v1/readings/generate`, enviando los IDs del perfil y la plantilla.
6. Consulta el historial con `GET /api/v1/readings/history`; compara con `POST /api/v1/compatibility/check` y el ID del otro usuario.

Los detalles de campos, respuestas y rutas están en [documentacion/README_API.md](./documentacion/README_API.md).
