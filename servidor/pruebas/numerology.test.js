import test from 'node:test';
import assert from 'node:assert/strict';
import { calcularNumerosPrincipales } from '../codigo/servicios/numerology.js';

test('Calcula los números pitagóricos a partir del nombre y la fecha', () => {
  assert.deepEqual(
    calcularNumerosPrincipales('John Doe', '1990-07-15'),
    {
      numero_vida: 5,
      numero_expresion: 8,
      numero_alma: 8
    }
  );
});

test('Preserva los números maestros y normaliza tildes', () => {
  assert.deepEqual(
    calcularNumerosPrincipales('José', '2000-01-08'),
    {
      numero_vida: 11,
      numero_expresion: 4,
      numero_alma: 11
    }
  );
});

test('Rechaza datos que no permiten el cálculo del número del alma', () => {
  assert.throws(
    () => calcularNumerosPrincipales('BC', '1990-07-15'),
    { name: 'TypeError' }
  );
});
