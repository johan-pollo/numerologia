# Correcciones de seguridad y validación

Este documento describe los cambios aplicados a la API a partir del reporte de ataques. Las validaciones de entrada buscan rechazar datos inválidos antes de ejecutar los controladores o acceder a MongoDB, y las respuestas de error no deben revelar detalles internos de la aplicación.

## Cambios aplicados

### 1. Manejo seguro de JSON malformado y rutas API inexistentes

**Ataques relacionados:** #1 y los reportes #4 y #6.

**Problema:** Express respondía al JSON sintácticamente inválido con su manejador predeterminado, que podía incluir una traza y rutas locales del servidor. Además, una ruta API inexistente podía responder con una página HTML genérica o un cuerpo poco informativo.

**Implementación:** En `app.js` se añadieron dos manejadores después del registro de las rutas. El primero responde a las rutas bajo `/api` que no existen con estado `404` y un JSON con el mensaje `Ruta no encontrada`. El manejador de errores reconoce el estado `400` que produce el parser de Express y responde `Solicitud JSON inválida`, sin incluir la excepción ni su traza. Otros errores de cliente reciben un mensaje genérico; los errores internos se responden como `Error interno del servidor`.

**Resultado:** El ataque #1 recibe un `400` controlado en JSON y no expone detalles de Node.js o del sistema de archivos.

**Nota sobre #4 y #6:** En el código del proyecto, `/api/usuarios` sí está montada. Por eso, los `404` descritos en el reporte no se explican por una ruta ausente en esta versión; pudieron deberse a la URL base, al servidor ejecutado o a una versión anterior. El nuevo manejador hace explícito el JSON de rutas API realmente inexistentes.

### 2. Validación de registro, actualización e inicio de sesión

**Ataques relacionados:** #2, #3, #4, #8, #9, #10 y #11.

**Problema:** La validación anterior comprobaba principalmente que los campos no estuvieran vacíos. Valores con tipos incorrectos o fechas inválidas podían alcanzar Mongoose y producir errores de conversión.

**Implementación:** En `src/validators/uservalidator.js` se reforzaron `crearUsuarioValidator`, `actualizarUsuarioValidator` y `loginValidator`:

- El nombre debe ser texto; se recorta con `trim()` y se vuelve a comprobar que no quede vacío.
- El email debe ser texto, se recorta y debe cumplir el formato de email.
- La contraseña debe ser texto y no estar vacía.
- La fecha de nacimiento debe ser texto con formato ISO 8601 estricto.
- Se usan `bail()` para detener las comprobaciones de un campo cuando una condición previa ya falló.

Las rutas de usuarios ya ejecutaban estos validadores junto con `validarCampos`, que devuelve `400` y una lista de errores de campo. Se conservaron los mensajes de campos obligatorios para mantener las respuestas existentes.

**Resultado:** Valores como un nombre numérico, una fecha booleana, un email que no sea texto o un nombre compuesto solo por espacios se rechazan con `400` antes de crear o actualizar el usuario. Las entradas NoSQL reportadas en el email también fallan las comprobaciones de tipo o formato.

### 3. Validación para crear perfiles numerológicos

**Ataques relacionados:** #13, #14, #15 y #16.

**Problema:** La ruta autenticada de creación de perfiles no tenía validadores de cuerpo. La ausencia de campos, un ObjectId inválido o un texto como `cinco` llegaban a Mongoose, que respondía con errores de validación o casteo.

**Implementación:** Se creó `crearPerfilValidator` en `src/validators/uservalidator.js`. Comprueba que `usuario` sea una cadena con formato MongoDB ObjectId y que `numero_vida`, `numero_expresion` y `numero_alma` sean números finitos, no cadenas numéricas ni otros tipos. En `src/routes/numerologyProfile.routes.js`, el POST ejecuta el validador y `validarCampos` después de la autenticación y antes de `crearPerfil`.

**Resultado:** Los campos ausentes, IDs mal formados y tipos incompatibles se rechazan con `400`; esos valores ya no llegan al controlador para provocar errores de Mongoose. La ruta continúa requiriendo token, por lo que una petición sin autenticación responde `401` como antes.

### 4. Validación del tipo de lectura

**Ataque relacionado:** #5.

**Problema:** `tipo_lectura` era una cadena libre tanto en el esquema como en la ruta POST, por lo que se aceptaban valores inventados.

**Implementación:** Se creó `crearLecturaValidator` en `src/validators/uservalidator.js` para exigir que `prompt` y `respuesta` sean texto no vacío, y que `tipo_lectura` sea uno de `diaria`, `general` o `anual`. `src/routes/reading.routes.js` ejecuta el validador antes del controlador. También se añadió el mismo enum al esquema en `src/models/Readings.js`, como segunda barrera al guardar documentos. `README_API.md` ahora documenta los valores permitidos.

**Resultado:** El tipo inventado del ataque se rechaza con `400` y no se guarda.

### 5. Ocultamiento de errores internos en controladores

**Ataques relacionados:** #3, #14, #15 y #16.

**Problema:** Los bloques `catch` de los controladores incluían `error.message` en la respuesta HTTP. Mensajes de Mongoose podían revelar nombres de modelos, campos y detalles de conversión.

**Implementación:** En `src/controllers/usuario.controller.js`, `src/controllers/numerologyProfile.controller.js` y `src/controllers/reading.controller.js` se quitaron las propiedades `error` que exponían `error.message`. Las respuestas conservan su mensaje general y su estado de error, pero no incluyen el detalle interno.

**Resultado:** Si ocurre un error inesperado de persistencia, el cliente recibe un mensaje genérico en vez del mensaje de Mongoose. Los errores esperables de entrada se interceptan antes por los validadores y responden `400`.

## Ataques que no requirieron una corrección adicional

- **#7, caracteres especiales en el nombre:** La cadena `Juan ' OR 1=1 --` no es una inyección SQL en esta API, que usa MongoDB. No se añadió una regla para prohibir apóstrofes u otros caracteres legítimos en nombres. La prevención de XSS debe hacerse al presentar contenido en una interfaz; en la interfaz existente el nombre se asigna mediante `textContent`, no como HTML.
- **#17, asignación masiva de `isVIP`:** El esquema de Mongoose usa el modo estricto predeterminado y descarta campos que no están definidos en el esquema. El ataque ya estaba defendido; no se modificó esa conducta.
- **#8–#13:** Los casos de validación del login, credenciales incorrectas y falta de token ya tenían respuestas controladas en los validadores o middleware de autenticación. Se conservaron y se reforzó la comprobación de tipos del login.

## Pruebas

Se añadieron pruebas HTTP en `tests/app.test.js` para verificar JSON malformado sin traza, tipos incorrectos y nombres en blanco en el registro, mensajes para campos obligatorios, IDs y números de perfil inválidos, y tipos de lectura no permitidos. Se ejecutó `npm test`: las 7 pruebas finalizaron correctamente. Estas pruebas comprueban validación y respuestas HTTP sin requerir una conexión a MongoDB.
