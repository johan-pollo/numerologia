import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import app from '../app.js';
import {
  crearPerfilValidator,
  actualizarUsuarioValidator
} from '../codigo/validadores/uservalidator.js';
import User from '../codigo/modelos/User.js';

process.env.NODE_ENV = 'test';
process.env.JWT_SECRET ??= randomBytes(32).toString('hex');
const usuarioIdPrueba = '6ab14844f3428cb9fb9c90e3';
let usuarioAutenticado = { _id: usuarioIdPrueba, activo: true };
User.findById = (id) => ({
  select: async () => usuarioAutenticado?._id === id ? usuarioAutenticado : null
});
const token = jwt.sign({ usuarioId: usuarioIdPrueba }, process.env.JWT_SECRET);

async function iniciarServidor() {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  return server;
}

test('La aplicación Express se crea correctamente', () => {
  assert.equal(typeof app.use, 'function');
  assert.equal(typeof app.listen, 'function');
});

test('Las rutas versionadas de autenticación son públicas y el perfil requiere JWT', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const registro = await fetch(`http://127.0.0.1:${port}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    const perfil = await fetch(`http://127.0.0.1:${port}/api/v1/numerology/profile`);
    const historial = await fetch(`http://127.0.0.1:${port}/api/v1/readings/history`);

    assert.equal(registro.status, 400);
    assert.equal(perfil.status, 401);
    assert.equal(historial.status, 401);
  } finally {
    server.close();
  }
});

test('El JWT se rechaza si el usuario no existe o está inactivo', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    for (const usuario of [null, { _id: usuarioIdPrueba, activo: false }]) {
      usuarioAutenticado = usuario;
      const respuesta = await fetch(`http://127.0.0.1:${port}/api/v1/numerology/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      assert.equal(respuesta.status, 401);
    }
  } finally {
    usuarioAutenticado = { _id: usuarioIdPrueba, activo: true };
    server.close();
  }
});

test('Las reglas de actualización aceptan cambios parciales y rechazan objetos vacíos', async () => {
  const parcial = { body: { email: ' ana@example.com ' } };
  await Promise.all(actualizarUsuarioValidator.map((validator) => validator.run(parcial)));
  assert.equal(validationResult(parcial).isEmpty(), true);

  const vacio = { body: {} };
  await Promise.all(actualizarUsuarioValidator.map((validator) => validator.run(vacio)));
  assert.equal(validationResult(vacio).isEmpty(), false);
  assert.ok(validationResult(vacio).array().every((error) => typeof error.path === 'string'));
});

test('Las rutas desconocidas responden JSON 404', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const respuesta = await fetch(`http://127.0.0.1:${port}/ruta-inexistente`);
    assert.equal(respuesta.status, 404);
    assert.deepEqual(await respuesta.json(), { mensaje: 'Ruta no encontrada' });
  } finally {
    server.close();
  }
});

test('Las rutas versionadas de generación y compatibilidad validan IDs antes de MongoDB', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
    const lectura = await fetch(`http://127.0.0.1:${port}/api/v1/readings/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ matriz_id: 'invalido', plantilla_id: 'invalido' })
    });
    const compatibilidad = await fetch(`http://127.0.0.1:${port}/api/v1/compatibility/check`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ usuario_2: 'invalido' })
    });

    assert.equal(lectura.status, 400);
    assert.equal(compatibilidad.status, 400);
  } finally {
    server.close();
  }
});

test('El dashboard HTML de numerología responde correctamente', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const respuesta = await fetch(`http://127.0.0.1:${port}/dashboard`);
    const html = await respuesta.text();

    assert.equal(respuesta.status, 200);
    assert.match(html, /Numerología|dashboard/i);
    assert.match(html, /id="lifeNumber"/);
    assert.match(html, /id="expressionNumber"/);
    assert.match(html, /id="soulNumber"/);
    assert.doesNotMatch(html, /profileCount|profilesTable/);
  } finally {
    server.close();
  }
});

test('El JSON malformado responde 400 sin exponer el stack', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const respuesta = await fetch(`http://127.0.0.1:${port}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"nombre_completo":}'
    });
    const data = await respuesta.json();

    assert.equal(respuesta.status, 400);
    assert.equal(data.mensaje, 'Solicitud JSON inválida');
    assert.equal('error' in data, false);
  } finally {
    server.close();
  }
});

test('El parser limita el tamaño de solicitudes JSON', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const respuesta = await fetch(`http://127.0.0.1:${port}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contenido: 'x'.repeat(17 * 1024) })
    });

    assert.equal(respuesta.status, 413);
  } finally {
    server.close();
  }
});

test('El registro rechaza tipos incorrectos y nombres en blanco', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    for (const body of [
      { nombre_completo: 12345, email: 'ana@example.com', password: 'clave', fecha_nacimiento: '2020-12-24' },
      { nombre_completo: '   ', email: 'ana@example.com', password: 'clave', fecha_nacimiento: true }
    ]) {
      const respuesta = await fetch(`http://127.0.0.1:${port}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      assert.equal(respuesta.status, 400);
    }
  } finally {
    server.close();
  }
});

test('El registro rechaza contraseñas que exceden el límite de bcrypt', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const respuesta = await fetch(`http://127.0.0.1:${port}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_completo: 'Ana Pérez',
        email: 'ana@example.com',
        password: '😀'.repeat(19),
        fecha_nacimiento: '1995-08-21'
      })
    });

    assert.equal(respuesta.status, 400);
  } finally {
    server.close();
  }
});

test('El registro exige un mínimo de ocho caracteres en la contraseña', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const respuesta = await fetch(`http://127.0.0.1:${port}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre_completo: 'Ana Pérez',
        email: 'ana@example.com',
        password: 'corta7',
        fecha_nacimiento: '1995-08-21'
      })
    });

    assert.equal(respuesta.status, 400);
  } finally {
    server.close();
  }
});

test('El registro mantiene los mensajes de campos obligatorios', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const respuesta = await fetch(`http://127.0.0.1:${port}/api/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    const data = await respuesta.json();

    assert.equal(respuesta.status, 400);
    assert.deepEqual(data.errores.map((error) => error.campo), [
      'nombre_completo', 'email', 'password', 'fecha_nacimiento'
    ]);
    assert.equal(data.errores[1].mensaje, 'El email es obligatorio');
    assert.equal(data.errores[2].mensaje, 'La contraseña es obligatoria');
  } finally {
    server.close();
  }
});

test('La creación de perfil valida ObjectId y números antes de MongoDB', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    for (const body of [
      { numero_vida: 'cinco', numero_expresion: 3, numero_alma: 7 },
      { numero_expresion: 3, numero_alma: 7 },
      { numero_vida: 10000000000, numero_expresion: 3, numero_alma: 7 },
      { numero_vida: 1.5, numero_expresion: 3, numero_alma: 7 },
      { numero_vida: 0, numero_expresion: 3, numero_alma: 7 }
    ]) {
      const respuesta = await fetch(`http://127.0.0.1:${port}/api/perfiles`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body)
      });

      assert.equal(respuesta.status, 400);
    }
  } finally {
    server.close();
  }
});

test('La creación de perfil acepta números de hasta 10 dígitos', async () => {
  const req = {
    body: {
        numero_vida: 9999999999,
        numero_expresion: 3,
        numero_alma: 7
    }
  };

  await Promise.all(crearPerfilValidator.map((validator) => validator.run(req)));

  assert.equal(validationResult(req).isEmpty(), true);
});

test('La creación de lectura rechaza tipos fuera de los permitidos', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const respuesta = await fetch(`http://127.0.0.1:${port}/api/lecturas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ prompt: 'Mi lectura', respuesta: 'Texto respuesta', tipo_lectura: 'TIPO_SUPER_INVENTADO_999' })
    });

    assert.equal(respuesta.status, 400);
  } finally {
    server.close();
  }
});
