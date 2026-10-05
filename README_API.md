# API de Numerologia

API REST para gestionar usuarios, perfiles numerologicos, lecturas, compatibilidades y registros de auditoria.

## Inicio rapido

### Requisitos

- Node.js 20.19 o superior (requisito de Mongoose 9).
- npm (incluido con Node.js).
- Un cluster de MongoDB Atlas, o una instancia local de MongoDB.
- Usuario de base de datos y acceso de red configurados en Atlas.

### Instalacion

```bash
npm install
```

En Windows, crea el archivo local de variables de entorno:

```powershell
Copy-Item .env.example .env
```

Edita `.env` y configura la URI del cluster, la base de datos y una clave JWT privada. Ejemplo de estructura (reemplaza los marcadores; no publiques credenciales):

```env
PORT=3001
MONGODB_URI=mongodb+srv://<usuario>:<contrasena>@<cluster>.mongodb.net/?appName=vuelos
MONGODB_DB_NAME=numerologia
JWT_SECRET=usa-una-clave-privada-de-al-menos-32-bytes
```

En Atlas, permite la IP desde la que se ejecuta la API en **Network Access** y crea el usuario de base de datos en **Database Access**. Si la contrasena contiene caracteres especiales, codificalos para una URI. La aplicacion conecta Mongoose a la base indicada por `MONGODB_DB_NAME` y solo despues inicia el servidor.

Si el DNS de tu red no resuelve el registro SRV del cluster, puedes definir opcionalmente `MONGODB_DNS_SERVERS` con uno o varios servidores DNS separados por comas.

Inicia la API:

```bash
npm start
```

Para desarrollo con reinicio automatico:

```bash
npm run dev
```

La API quedara disponible en `http://localhost:3001`, salvo que configures otro puerto.

La interfaz web esta disponible en:

```text
http://localhost:3001/
```

## Ejecucion con Docker

Construye la imagen y ejecuta el contenedor pasando las variables desde el archivo local `.env`:

```bash
docker build -t api-numerologia .
docker run --rm --name api-numerologia --env-file .env -p 3001:3001 api-numerologia
```

La imagen usa un usuario no privilegiado y comprueba `/health`. Si MongoDB se ejecuta en el mismo equipo y no en Atlas, usa `host.docker.internal` en `MONGODB_URI` desde el contenedor.

### Tecnologias y estructura

- **Node.js y Express 5:** servidor HTTP, API REST y entrega de la interfaz estatica.
- **MongoDB Atlas y Mongoose 9:** persistencia, esquemas y modelos de datos.
- **dotenv:** carga de configuracion desde `.env`.
- **JSON Web Token y bcryptjs:** autenticacion y manejo seguro de contrasenas.
- **express-validator:** validacion de solicitudes.
- **Node.js Test Runner:** pruebas automatizadas con `node --test`.

```text
app.js                 Configuracion de Express, rutas y manejo de errores
server.js              Conexion a MongoDB e inicio del servidor
src/
  controllers/         Logica de usuarios, perfiles, lecturas y auditoria
  database/            Conexion con MongoDB Atlas mediante Mongoose
  middlewares/         Autenticacion y validacion compartida
  models/              Esquemas y modelos de Mongoose
  routes/              Endpoints de la API
  validators/          Reglas de validacion
public/                Interfaz web estatica
tests/                 Pruebas automatizadas
.env.example           Plantilla de configuracion local
```

### Cambios de esta configuracion

- La conexion usa Mongoose, igual que los modelos del proyecto, y selecciona la base `numerologia` mediante `MONGODB_DB_NAME`.
- Las credenciales se leen desde `.env`; el archivo esta excluido de Git. No guardes URI ni claves reales en el README o en `.env.example`.
- El servidor espera una conexion exitosa antes de escuchar solicitudes y termina con un error claro si falla la conexion.

Tambien se conserva `http://localhost:3001/dashboard` como alias compatible. El archivo de entrada del frontend es `public/index.html`, para facilitar su despliegue como sitio estatico.

### Comprobar el servidor

```text
GET http://localhost:3001/health
```

Respuesta esperada:

```json
{
  "estado": "ok",
  "servicio": "api-numerologia"
}
```

Para usar Dev Tunnels, crea o configura el tunel sobre el puerto `3001`. La URL publica debe responder `200` en `/health`; si devuelve `Allow: GET, HEAD, OPTIONS` en una solicitud `POST`, el tunel esta apuntando a un servicio estatico y no a Express.

## Variables de entorno

Crea un archivo `.env` en la raiz del proyecto:

```env
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=numerologia
JWT_SECRET=usa-una-clave-privada-de-al-menos-32-bytes
```

Para MongoDB Atlas, reemplaza `MONGODB_URI` por la cadena de conexion de tu cluster. La aplicacion exige `MONGODB_URI` y un `JWT_SECRET` de al menos 32 bytes antes de iniciar. No compartas el archivo `.env` ni publiques sus credenciales.

## Configuracion para compartir la API

Reemplaza la URL base en los ejemplos por la URL de tu servicio desplegado:

```text
https://tu-dominio.example.com
```

Las rutas principales de autenticacion y numerologia usan el prefijo versionado `/api/v1`. Las rutas CRUD originales bajo `/api` se conservan por compatibilidad.

## Autenticacion

El registro y el inicio de sesion son publicos. El resto de endpoints requiere el JWT obtenido en el login.

En cada solicitud protegida envia el token asi:

```http
Authorization: Bearer TU_TOKEN
```

No uses `x-token` ni la pestaña Auth del tipo Basic. El token expira en 2 horas.

## API versionada principal

### Registrar e iniciar sesion

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
Content-Type: application/json
```

El registro recibe `nombre_completo`, `email`, `password` y `fecha_nacimiento`. La contraseña debe tener al menos 8 caracteres y no superar 72 bytes. El inicio de sesion devuelve el JWT y los datos publicos del usuario.

### Calcular y consultar el perfil numerologico

```http
POST /api/v1/numerology/calculate
Authorization: Bearer <token>
Content-Type: application/json

{}
```

El servidor calcula `numero_vida`, `numero_expresion` y `numero_alma` con el metodo pitagorico a partir del nombre completo y la fecha de nacimiento guardados en la cuenta. Reduce los resultados a un digito y conserva los numeros maestros 11, 22 y 33. Recalcular actualiza el perfil asociado al usuario autenticado.

```http
GET /api/v1/numerology/profile
Authorization: Bearer <token>
```

Responde `404` si todavia no se ha calculado un perfil.

### Historial de lecturas (solo consulta)

```http
GET /api/v1/readings/history
Authorization: Bearer <token>
```

La generacion de lecturas, la integracion con Gemini y la interpretacion de compatibilidad quedan aplazadas y no forman parte de esta version.

Las solicitudes JSON tienen un limite de 16 KB. Los recursos privados se consultan y modifican solo dentro del alcance del usuario autenticado. La auditoria se genera automaticamente para solicitudes autenticadas y sus registros no se pueden crear o modificar manualmente.

## Rutas CRUD legadas (`/api`)

Se conservan las rutas CRUD originales documentadas a continuacion por compatibilidad. Para registro, inicio de sesion y calculo del perfil, usa preferentemente la API versionada.

## 1. Usuarios y autenticacion

### Registrar usuario

```http
POST /api/usuarios
Content-Type: application/json
```

```json
{
  "nombre_completo": "Ana Perez",
  "email": "ana@example.com",
  "password": "una-clave-segura",
  "fecha_nacimiento": "1995-08-21"
}
```

Ejemplo:

```bash
curl -X POST http://localhost:3001/api/usuarios ^
  -H "Content-Type: application/json" ^
  -d "{\"nombre_completo\":\"Ana Perez\",\"email\":\"ana@example.com\",\"password\":\"una-clave-segura\",\"fecha_nacimiento\":\"1995-08-21\"}"
```

### Iniciar sesion

```http
POST /api/usuarios/login
Content-Type: application/json
```

```json
{
  "email": "ana@example.com",
  "password": "una-clave-segura"
}
```

La respuesta incluye `token` y los datos publicos del usuario. Guarda ese token para las siguientes solicitudes.

Las rutas de consulta y modificacion de usuarios solo permiten acceder a la cuenta asociada al token. Los hash de contrasena nunca se incluyen en las respuestas.

### Listar usuarios

```http
GET /api/usuarios
Authorization: Bearer TU_TOKEN
```

### Obtener un usuario

```http
GET /api/usuarios/ID_USUARIO
Authorization: Bearer TU_TOKEN
```

### Actualizar un usuario

```http
PUT /api/usuarios/ID_USUARIO
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

```json
{
  "nombre_completo": "Ana Perez Actualizada",
  "email": "ana.nueva@example.com",
  "password": "otra-clave-segura",
  "fecha_nacimiento": "1995-08-21"
}
```

### Eliminar un usuario

```http
DELETE /api/usuarios/ID_USUARIO
Authorization: Bearer TU_TOKEN
```

## 2. Perfiles numerologicos

Todos los endpoints de esta seccion requieren autenticacion.

### Crear perfil

```http
POST /api/perfiles
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

```json
{
  "usuario": "ID_USUARIO",
  "numero_vida": 5,
  "numero_expresion": 3,
  "numero_alma": 7
}
```

Los campos `numero_vida`, `numero_expresion` y `numero_alma` deben ser enteros positivos de hasta 10 dígitos.

### Listar perfiles

```http
GET /api/perfiles
Authorization: Bearer TU_TOKEN
```

### Obtener un perfil

```http
GET /api/perfiles/ID_PERFIL
Authorization: Bearer TU_TOKEN
```

### Actualizar un perfil

```http
PUT /api/perfiles/ID_PERFIL
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

```json
{
  "numero_vida": 6,
  "numero_expresion": 3,
  "numero_alma": 9
}
```

### Eliminar un perfil

```http
DELETE /api/perfiles/ID_PERFIL
Authorization: Bearer TU_TOKEN
```

## 3. Lecturas

Todos los endpoints de esta seccion requieren autenticacion.

### Crear lectura

```http
POST /api/lecturas
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

```json
{
  "prompt": "Quiero mi lectura de hoy",
  "respuesta": "Hoy tendras un dia de nuevas oportunidades.",
  "tipo_lectura": "diaria"
}
```

`tipo_lectura` solo acepta `diaria`, `general` o `anual`.

### Listar lecturas

```http
GET /api/lecturas
Authorization: Bearer TU_TOKEN
```

### Obtener una lectura

```http
GET /api/lecturas/ID_LECTURA
Authorization: Bearer TU_TOKEN
```

### Actualizar una lectura

```http
PUT /api/lecturas/ID_LECTURA
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

```json
{
  "prompt": "Actualiza mi lectura",
  "respuesta": "Tu energia favorece los cambios positivos.",
  "tipo_lectura": "general"
}
```

### Eliminar una lectura

```http
DELETE /api/lecturas/ID_LECTURA
Authorization: Bearer TU_TOKEN
```

## 4. Compatibilidades

Todos los endpoints de esta seccion requieren autenticacion.

### Crear compatibilidad

```http
POST /api/compatibilidades
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

```json
{
  "usuario_2": "ID_USUARIO_2",
  "puntaje": 85,
  "interpretacion_ia": "Alta compatibilidad emocional y espiritual."
}
```

Ambos valores `usuario_1` y `usuario_2` deben ser ObjectId validos de MongoDB.
En creacion, `usuario_1` se toma del token de autenticacion; solo se envia `usuario_2`. Estas rutas legadas solo almacenan datos proporcionados, sin calcular compatibilidades ni generar interpretaciones mediante IA.

### Listar compatibilidades

```http
GET /api/compatibilidades
Authorization: Bearer TU_TOKEN
```

### Obtener una compatibilidad

```http
GET /api/compatibilidades/ID_COMPATIBILIDAD
Authorization: Bearer TU_TOKEN
```

### Actualizar una compatibilidad

```http
PUT /api/compatibilidades/ID_COMPATIBILIDAD
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

```json
{
  "puntaje": 90,
  "interpretacion_ia": "Compatibilidad muy alta."
}
```

### Eliminar una compatibilidad

```http
DELETE /api/compatibilidades/ID_COMPATIBILIDAD
Authorization: Bearer TU_TOKEN
```

## 5. Auditoria

Los registros se crean automaticamente al finalizar solicitudes autenticadas. Solo estan disponibles las rutas `GET`; no se permite crear, actualizar ni eliminar registros manualmente, y cada usuario consulta unicamente sus propios registros. Los ejemplos POST, PUT y DELETE heredados de esta seccion se conservan como referencia historica, pero ya no estan habilitados.

Todos los endpoints de esta seccion requieren autenticacion.

### Ejemplo legado: crear registro manual (deshabilitado)

```http
POST /api/auditoria
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

```json
{
  "endpoint": "/api/perfiles",
  "metodo": "GET",
  "status_code": 200,
  "user_id": "ID_USUARIO"
}
```

### Listar registros

```http
GET /api/auditoria
Authorization: Bearer TU_TOKEN
```

### Obtener un registro

```http
GET /api/auditoria/ID_AUDITORIA
Authorization: Bearer TU_TOKEN
```

### Ejemplo legado: actualizar un registro (deshabilitado)

```http
PUT /api/auditoria/ID_AUDITORIA
Authorization: Bearer TU_TOKEN
Content-Type: application/json
```

```json
{
  "endpoint": "/api/perfiles",
  "metodo": "POST",
  "status_code": 201
}
```

### Ejemplo legado: eliminar un registro (deshabilitado)

```http
DELETE /api/auditoria/ID_AUDITORIA
Authorization: Bearer TU_TOKEN
```

## Respuestas y errores

Las respuestas exitosas usan JSON. Los codigos mas habituales son:

| Codigo | Significado |
| --- | --- |
| `200` | Solicitud exitosa |
| `201` | Recurso creado |
| `400` | Datos de entrada invalidos |
| `401` | Token ausente, invalido o expirado |
| `404` | Recurso no encontrado |
| `500` | Error interno o de base de datos |

Ejemplo de error de autenticacion:

```json
{
  "mensaje": "Token de autenticacion requerido"
}
```

Los parametros `:id` deben ser ObjectId validos de MongoDB. Las operaciones de lectura y escritura dependen de que MongoDB este disponible.

## Prueba rapida con JavaScript

```js
const baseUrl = "http://localhost:3001";

const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "ana@example.com",
    password: "una-clave-segura"
  })
});

const { token } = await loginResponse.json();

const profilesResponse = await fetch(`${baseUrl}/api/v1/numerology/profile`, {
  headers: { Authorization: `Bearer ${token}` }
});

console.log(await profilesResponse.json());
```

## Importante antes de publicar

- Configura `MONGODB_URI`, `MONGODB_DB_NAME`, `JWT_SECRET` y `PORT` en el servicio de despliegue.
- No subas `.env` a GitHub.
- Usa HTTPS en la URL publica.
- Cambia `JWT_SECRET` por una clave larga y privada.
- La URL publica depende del proveedor donde despliegues Node.js; GitHub por si solo almacena el codigo y no ejecuta esta API.
