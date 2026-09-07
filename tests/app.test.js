import test from 'node:test';
import assert from 'node:assert/strict';
import app from '../app.js';

async function iniciarServidor() {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  return server;
}

test('La aplicación Express se crea correctamente', () => {
  assert.equal(typeof app.use, 'function');
  assert.equal(typeof app.listen, 'function');
});

test('El dashboard HTML de numerología responde correctamente', async () => {
  const server = await iniciarServidor();
  const { port } = server.address();

  try {
    const respuesta = await fetch(`http://127.0.0.1:${port}/dashboard`);
    const html = await respuesta.text();

    assert.equal(respuesta.status, 200);
    assert.match(html, /Numerología|dashboard/i);
  } finally {
    server.close();
  }
});
