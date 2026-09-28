# API de Numerologia

API REST para gestionar usuarios, perfiles numerologicos, lecturas, compatibilidades y registros de auditoria.

## Inicio rapido

### Requisitos

- Node.js 18 o superior.
- MongoDB local o MongoDB Atlas.
- Una variable `JWT_SECRET` configurada.

### Instalacion

```bash
npm install
npm start
```

Para desarrollo:

```bash
npm run dev
```

La API quedara disponible en `http://localhost:3001`, salvo que configures otro puerto.

La interfaz web esta disponible en:

```text
http://localhost:3001/
```

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
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/numerologia
JWT_SECRET=cambia-esta-clave-por-una-secreta-y-larga
```

Para MongoDB Atlas, reemplaza `MONGO_URI` por la cadena de conexion de tu cluster. No compartas el archivo `.env` ni publiques sus credenciales.

## Configuracion para compartir la API

Reemplaza la URL base en los ejemplos por la URL de tu servicio desplegado:

```text
https://tu-dominio.example.com
```

La API no agrega automaticamente el prefijo `/api/v1`. Las rutas publicadas actualmente comienzan con `/api`.

## Autenticacion

El registro y el inicio de sesion son publicos. El resto de endpoints requiere el JWT obtenido en el login.

En cada solicitud protegida envia el token asi:

```http
Authorization: Bearer TU_TOKEN
```

No uses `x-token` ni la pestaña Auth del tipo Basic. El token expira en 2 horas.

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
curl -X POST http://localhost:3000/api/usuarios ^
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
  "usuario_1": "ID_USUARIO_1",
  "usuario_2": "ID_USUARIO_2",
  "puntaje": 85,
  "interpretacion_ia": "Alta compatibilidad emocional y espiritual."
}
```

Ambos valores `usuario_1` y `usuario_2` deben ser ObjectId validos de MongoDB.

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

Todos los endpoints de esta seccion requieren autenticacion.

### Crear registro de auditoria

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

### Actualizar un registro

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

### Eliminar un registro

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
const baseUrl = "http://localhost:3000";

const loginResponse = await fetch(`${baseUrl}/api/usuarios/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "ana@example.com",
    password: "una-clave-segura"
  })
});

const { token } = await loginResponse.json();

const profilesResponse = await fetch(`${baseUrl}/api/perfiles`, {
  headers: { Authorization: `Bearer ${token}` }
});

console.log(await profilesResponse.json());
```

## Importante antes de publicar

- Configura `MONGO_URI`, `JWT_SECRET` y `PORT` en el servicio de despliegue.
- No subas `.env` a GitHub.
- Usa HTTPS en la URL publica.
- Cambia `JWT_SECRET` por una clave larga y privada.
- La URL publica depende del proveedor donde despliegues Node.js; GitHub por si solo almacena el codigo y no ejecuta esta API.
