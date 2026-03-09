import { test, expect } from '@playwright/test';

const API = 'http://localhost:3001/api/presets';

test.describe('Presets API', () => {
  let createdId: string;

  test('GET /api/presets returns an array', async ({ request }) => {
    const res = await request.get(API);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test('POST /api/presets creates a preset', async ({ request }) => {
    const res = await request.post(API, {
      data: { name: 'E2E Test', workoutDuration: 20, breakDuration: 10, rounds: 3 },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.id).toBeDefined();
    expect(body.name).toBe('E2E Test');
    createdId = body.id;
  });

  test('POST /api/presets rejects invalid data', async ({ request }) => {
    const res = await request.post(API, {
      data: { name: '', workoutDuration: -1, breakDuration: 0, rounds: 0 },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.errors).toBeDefined();
  });

  test('GET /api/presets/:id returns the preset', async ({ request }) => {
    const res = await request.get(`${API}/${createdId}`);
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    expect(body.id).toBe(createdId);
  });

  test('DELETE /api/presets/:id removes the preset', async ({ request }) => {
    const res = await request.delete(`${API}/${createdId}`);
    expect(res.status()).toBe(204);
    const check = await request.get(`${API}/${createdId}`);
    expect(check.status()).toBe(404);
  });
});
