import { test, expect } from '@playwright/test';

const API = 'http://localhost:3001/api/presets';

test.describe('Presets API', () => {
  let createdId: string;

  test.beforeAll(async ({ request }) => {
    const res = await request.post(API, {
      data: { name: 'E2E Test', workoutDuration: 20, breakDuration: 10, rounds: 3 },
    });
    createdId = (await res.json()).id;
  });

  test.afterAll(async ({ request }) => {
    await request.delete(`${API}/${createdId}`);
  });

  test('GET /api/presets returns an array', async ({ request }) => {
    const res = await request.get(API);
    expect(res.ok(), 'GET /api/presets should return 2xx status').toBeTruthy();
    const body = await res.json();
    expect(Array.isArray(body), 'Response body should be an array').toBe(true);
  });

  test('POST /api/presets creates a preset', async ({ request }) => {
    const res = await request.post(API, {
      data: { name: 'E2E Test', workoutDuration: 20, breakDuration: 10, rounds: 3 },
    });
    expect(res.status(), 'Creating a preset should return 201 Created').toBe(201);
    const body = await res.json();
    expect(body.id, 'Created preset should have an id').toBeDefined();
    expect(body.name, 'Created preset name should match the sent value').toBe('E2E Test');

    await request.delete(`${API}/${body.id}`);
  });

  test('POST /api/presets rejects invalid data', async ({ request }) => {
    const res = await request.post(API, {
      data: { name: '', workoutDuration: -1, breakDuration: 0, rounds: 0 },
    });
    expect(res.status(), 'Invalid data should return 400 Bad Request').toBe(400);
    const body = await res.json();
    expect(body.errors, 'Response should contain an errors array').toBeDefined();
  });

  test('GET /api/presets/:id returns the preset', async ({ request }) => {
    const res = await request.get(`${API}/${createdId}`);
    expect(res.ok(), `GET /api/presets/${createdId} should return 2xx status`).toBeTruthy();
    const body = await res.json();
    expect(body.id, 'Returned preset id should match the requested id').toBe(createdId);
  });

  test('GET /api/presets/:id returns 404 for unknown id', async ({ request }) => {
    const res = await request.get(`${API}/nonexistent-id`);
    expect(res.status(), 'Unknown id should return 404 Not Found').toBe(404);
  });

  test('DELETE /api/presets/:id removes the preset', async ({ request }) => {
    const res = await request.post(API, {
      data: { name: 'To Delete', workoutDuration: 10, breakDuration: 5, rounds: 1 },
    });
    const { id } = await res.json();

    const deleteRes = await request.delete(`${API}/${id}`);
    expect(deleteRes.status(), 'DELETE should return 204 No Content').toBe(204);

    const check = await request.get(`${API}/${id}`);
    expect(check.status(), 'Fetching deleted preset should return 404 Not Found').toBe(404);
  });
});
