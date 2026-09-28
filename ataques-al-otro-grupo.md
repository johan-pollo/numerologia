```
ATAQUE #1 : (POST con contraseña corta)
Petición:    POST https://k1rm9wr9-3000.use.devtunnels.ms/api/v1/auth/register
Body:        {
    "nombre_completo": "Pepe Pablo",
    "email": "correo@ejemplo.com",
    "password_hash": "hola",
    "fecha_nacimiento": "2002-01-01"
  }
Respondió:   400,     "mensaje": "Error de validación",
    "errores": [
        {
            "campo": "password_hash",
            "mensaje": "La contraseña debe tener al menos 6 caracteres"
        }
    ]

Veredicto:   DEFENDIDO
```
```
ATAQUE #2 : (POST con nombre y contraseña como datos numéricos y correo invalido)
Petición:    POST api/v1/auth/register
Body:        {
    "nombre_completo": 12344,
    "email": "esteesuncorreofalso",
    "password_hash": 266565,
    "fecha_nacimiento": "2002-15-15"
  }
Respondió:   400, {
    "mensaje": "Error de validación",
    "errores": [
        {
            "campo": "email",
            "mensaje": "Debe ser un email válido"
        },
        {
            "campo": "fecha_nacimiento",
            "mensaje": "La fecha debe tener formato válido (YYYY-MM-DD)"
        }
    ]
}
Veredicto:   VULNERABLE, La validación permite nombre y contraseña como datos de tipo numérico
```
