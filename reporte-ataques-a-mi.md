# Reporte de Ataques

## Formato para cada ataque:

- **ATAQUE #__ :** (nombre)
- **Petición:** MÉTODO /ruta
- **Body:** `{ ... }`
- **Respondió:** código HTTP + lo que devolvió
- **Veredicto:** DEFENDIDO / VULNERABLE
- **Qué noté:** (qué esperabas que pasara vs qué pasó)

---

## ATAQUE #1 : Body con JSON malformado (Sintaxis inválida)

- **Petición:** `POST /api/usuarios`
- **Body:**
  ```json
  {
      "nombre_completo": 0000000
  }
  ```
- **Respondió:** `400 Bad Request`
- **Respuesta del servidor:**
  ```html
  <pre>SyntaxError: Unexpected number in JSON at position 26 (line 2 column 25)<br> &nbsp; &nbsp;at JSON.parse (&lt;anonymous&gt;)<br> &nbsp; &nbsp;at parse (C:\Users\USUARIO\Desktop\Trabajos SENA\Profe Miguel\Proyecto API numerologia\node_modules\body-parser\lib\types\json.js:91:21)<br> &nbsp; &nbsp;at C:\Users\USUARIO\Desktop\Trabajos SENA\Profe Miguel\Proyecto API numerologia\node_modules\body-parser\lib\read.js:162:18<br> &nbsp; &nbsp;at AsyncResource.runInAsyncScope (node:async_hooks:214:14)<br> &nbsp; &nbsp;at invokeCallback (C:\Users\USUARIO\Desktop\Trabajos SENA\Profe Miguel\Proyecto API numerologia\node_modules\raw-body\index.js:238:16)<br> &nbsp; &nbsp;at done (C:\Users\USUARIO\Desktop\Trabajos SENA\Profe Miguel\Proyecto API numerologia\node_modules\raw-body\index.js:227:7)<br> &nbsp; &nbsp;at IncomingMessage.onEnd (C:\Users\USUARIO\Desktop\Trabajos SENA\Profe Miguel\Proyecto API numerologia\node_modules\raw-body\index.js:287:7)<br> &nbsp; &nbsp;at IncomingMessage.emit (node:events:508:28)<br> &nbsp; &nbsp;at endReadableNT (node:internal/streams/readable:1701:12)<br> &nbsp; &nbsp;at process.processTicksAndRejections (node:internal/process/task_queues:89:21)</pre>
  ```
- **Veredicto:** **VULNERABLE**
- **Qué noté:** El servidor no manejó el error de forma adecuada y mostró información sensible. Se debe mejorar la validación.

---

## ATAQUE #2 : Campos vacíos

- **Petición:** `POST /api/usuarios`
- **Body:**
  ```json
  {}
  ```
- **Respondió:** `400 Bad Request`
- **Respuesta del servidor:**
  ```json
  {
      "mensaje": "Error de validación",
      "errores": [
          {
              "campo": "nombre_completo",
              "mensaje": "El nombre completo es obligatorio"
          },
          {
              "campo": "email",
              "mensaje": "El email es obligatorio"
          },
          {
              "campo": "password",
              "mensaje": "La contraseña es obligatoria"
          },
          {
              "campo": "fecha_nacimiento",
              "mensaje": "La fecha de nacimiento es obligatoria"
          }
      ]
  }
  ```
- **Veredicto:** **DEFENDIDO**
- **Qué noté:** La API detectó la ausencia de datos y devolvió un estado 400.

---

## ATAQUE #3 : Tipos cambiados (Booleano en campo de fecha)

- **Petición:** `POST /api/usuarios`
- **Body:**
  ```json
  {
      "nombre_completo": 12345,
      "email": "ana@example.com",
      "password": "clave",
      "fecha_nacimiento": true
  }
  ```
- **Respondió:** `500 Internal Server Error`
- **Respuesta del servidor:**
  ```json
  {
      "mensaje": "Error al crear el usuario",
      "error": "User validation failed: fecha_nacimiento: Cast to date failed for value \"true\" (type boolean) at path \"fecha_nacimiento\""
  }
  ```
- **Veredicto:** **VULNERABLE**
- **Qué noté:** El servidor no manejó el error de forma adecuada y mostró información sensible. Se debe mejorar la validación.

---

## ATAQUE #4 : Campos vacíos disfrazados

- **Petición:** `POST /api/usuarios`
- **Body:**
  ```json
  {
      "nombre_completo": "   ",
      "email": "ana@example.com",
      "password": "clave",
      "fecha_nacimiento": "2020-12-24"
  }
  ```
- **Respondió:** `404 Not Found`
- **Respuesta del servidor:**
  ```json
  {}
  ```
- **Veredicto:** **NO EVALUADO / RUTA INEXISTENTE**
- **Qué noté:** La petición devolvió un código HTTP 404 Not Found, lo que indica que la ruta no existe. Sin embargo, la petición debería haber sido manejada por el middleware de validación de campos.

---

## ATAQUE #5 : Valor inventado en un enum

- **Petición:** `POST /api/lecturas`
- **Body:**
  ```json
  {
    "prompt": "Mi lectura",
    "respuesta": "Texto respuesta",
    "tipo_lectura": "TIPO_SUPER_INVENTADO_999"
  }
  ```
- **Respondió:** `201 Created`
- **Respuesta del servidor:**
  ```json
  {}
  ```
- **Veredicto:** **VULNERABLE**
- **Qué noté:** El servidor aceptó el valor inventado en el enum y guardó el documento en la base de datos con un valor arbitrario. No cuenta con validaciones mediante express-validator, permitiendo valores inválidos en los campos.

---

## ATAQUE #6 : Inyección SQL

- **Petición:** `POST /api/usuarios`
- **Body:**
  ```json
  {
      "nombre_completo": "Juan ' OR 1=1 --",
      "email": "[EMAIL_ADDRESS]",
      "password": "clave",
      "fecha_nacimiento": "2020-12-24"
  }
  ```
- **Respondió:** `404 Not Found`
- **Respuesta del servidor:**
  ```json
  {}
  ```
- **Veredicto:** **NO EVALUADO / RUTA INEXISTENTE**
- **Qué noté:** La petición devolvió un código HTTP 404 Not Found, lo que indica que la ruta no existe. Sin embargo, la petición debería haber sido manejada por el middleware de validación de campos.

---

## ATAQUE #7 : Inyección de caracteres especiales (Sanitización de entradas)

- **Petición:** `POST /api/usuarios`
- **Body:**
  ```json
  {
    "nombre_completo": "Juan ' OR 1=1 --",
    "email": "juan_test_unique@example.com",
    "password": "clave",
    "fecha_nacimiento": "2020-12-24"
  }
  ```
- **Respondió:** `201 Created`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Usuario creado correctamente",
    "usuario": { "..." : "..." }
  }
  ```
- **Veredicto:** **VULNERABLE**
- **Qué noté:** La API procesó y almacenó el registro sin aplicar ningún filtro ni validación de caracteres especiales sobre el campo "nombre_completo". Guardó en la base de datos la cadena literal "Juan ' OR 1=1 --". Aunque MongoDB no ejecuta consultas SQL, la ausencia de sanitización permite la persistencia de datos malformados o posibles vectores de XSS.

---

## ATAQUE #8 : POST con campos obligatorios faltantes (Login)

- **Petición:** `POST /api/usuarios/login`
- **Body:**
  ```json
  {
    "email": "jesus.cristo@milagros.com"
  }
  ```
- **Respondió:** `400 Bad Request`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Error de validación",
    "errores": [
      {
        "campo": "password",
        "mensaje": "La contraseña es obligatoria"
      }
    ]
  }
  ```
- **Veredicto:** **DEFENDIDO**
- **Qué noté:** El validador detectó correctamente que faltaba la contraseña.

---

## ATAQUE #9 : POST con body vacío (Login)

- **Petición:** `POST /api/usuarios/login`
- **Body:**
  ```json
  {}
  ```
- **Respondió:** `400 Bad Request`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Error de validación",
    "errores": [
      {
        "campo": "email",
        "mensaje": "El email no es válido"
      },
      {
        "campo": "password",
        "mensaje": "La contraseña es obligatoria"
      }
    ]
  }
  ```
- **Veredicto:** **DEFENDIDO**
- **Qué noté:** El validador detectó la falta de ambos campos obligatorios.

---

## ATAQUE #10 : Inyección NoSQL en email (Login)

- **Petición:** `POST /api/usuarios/login`
- **Body:**
  ```json
  {
    "email": {"$gt": ""},
    "password": "elcamino"
  }
  ```
- **Respondió:** `400 Bad Request`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Error de validación",
    "errores": [
      {
        "campo": "email",
        "mensaje": "El email no es válido"
      }
    ]
  }
  ```
- **Veredicto:** **DEFENDIDO**
- **Qué noté:** La API rechazó el objeto NoSQL en el campo email.

---

## ATAQUE #11 : Tipos de datos incorrectos (Login)

- **Petición:** `POST /api/usuarios/login`
- **Body:**
  ```json
  {
    "email": 12345,
    "password": true
  }
  ```
- **Respondió:** `400 Bad Request`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Error de validación",
    "errores": [
      {
        "campo": "email",
        "mensaje": "El email no es válido"
      }
    ]
  }
  ```
- **Veredicto:** **DEFENDIDO**
- **Qué noté:** La API validó el tipo de dato y formato del email.

---

## ATAQUE #12 : Credenciales incorrectas (Login)

- **Petición:** `POST /api/usuarios/login`
- **Body:**
  ```json
  {
    "email": "jesus.cristo@milagros.com",
    "password": "claveincorrecta"
  }
  ```
- **Respondió:** `401 Unauthorized`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Email o contraseña incorrectos"
  }
  ```
- **Veredicto:** **DEFENDIDO**
- **Qué noté:** La API denegó el acceso por credenciales incorrectas.

---

## ATAQUE #13 : Petición sin token de autenticación

- **Petición:** `POST /api/perfiles`
- **Body:**
  ```json
  {
    "usuario": "ID_USUARIO",
    "numero_vida": 5,
    "numero_expresion": 3,
    "numero_alma": 7
  }
  ```
- **Respondió:** `401 Unauthorized`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Token de autenticación requerido"
  }
  ```
- **Veredicto:** **DEFENDIDO**
- **Qué noté:** La API rechazó la solicitud correctamente por falta de token.

---

## ATAQUE #14 : POST con campos obligatorios faltantes (Perfiles)

- **Petición:** `POST /api/perfiles`
- **Body:**
  ```json
  {
    "usuario": "ID_USUARIO",
    "numero_expresion": 3,
    "numero_alma": 7
  }
  ```
- **Respondió:** `500 Internal Server Error`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Error al crear el perfil numerológico",
    "error": "NumerologyProfile validation failed: numero_vida: Path `numero_vida` is required."
  }
  ```
- **Veredicto:** **VULNERABLE**
- **Qué noté:** La API devolvió un error interno de Mongoose en vez de un 400 controlado.

---

## ATAQUE #15 : ID de usuario con formato inválido (Perfiles)

- **Petición:** `POST /api/perfiles`
- **Body:**
  ```json
  {
    "usuario": "123abc_",
    "numero_vida": 5,
    "numero_expresion": 3,
    "numero_alma": 7
  }
  ```
- **Respondió:** `500 Internal Server Error`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Error al crear el perfil numerológico",
    "error": "NumerologyProfile validation failed: usuario: Cast to ObjectId failed for value \"123abc_\" (type string) at path \"usuario\""
  }
  ```
- **Veredicto:** **VULNERABLE**
- **Qué noté:** La API se rompió con un CastError de Mongoose filtrado al cliente.

---

## ATAQUE #16 : Tipos de datos alterados (Perfiles)

- **Petición:** `POST /api/perfiles`
- **Body:**
  ```json
  {
    "usuario": "ID_USUARIO",
    "numero_vida": "cinco",
    "numero_expresion": 3,
    "numero_alma": 7
  }
  ```
- **Respondió:** `500 Internal Server Error`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Error al crear el perfil numerológico",
    "error": "NumerologyProfile validation failed: numero_vida: Cast to Number failed for value \"cinco\" (type string) at path \"numero_vida\""
  }
  ```
- **Veredicto:** **VULNERABLE**
- **Qué noté:** Falta validación previa, el error de casteo de Mongoose se filtra al cliente.

---

## ATAQUE #17 : Inyección de campos no permitidos (Mass assignment)

- **Petición:** `POST /api/perfiles`
- **Body:**
  ```json
  {
    "usuario": "ID_USUARIO",
    "numero_vida": 5,
    "numero_expresion": 3,
    "numero_alma": 7,
    "isVIP": true
  }
  ```
- **Respondió:** `201 Created`
- **Respuesta del servidor:**
  ```json
  {
    "mensaje": "Perfil numerológico creado correctamente",
    "perfil": {
      "usuario": "6ab14844f3428cb9fb9c90e3",
      "numero_vida": 5,
      "numero_expresion": 3,
      "numero_alma": 7,
      "_id": "6ab15fc472884f60e6dcc37f",
      "__v": 0
    }
  }
  ```
- **Veredicto:** **DEFENDIDO**
- **Qué noté:** El esquema de Mongoose está en strict mode y eliminó silenciosamente el campo isVIP.
