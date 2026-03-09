import request from "supertest";
import app from "../src/app";

describe("Preset API", () => {
  let createdId: string;

  it("GET /api/presets returns empty array initially", async () => {
    const res = await request(app).get("/api/presets");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("POST /api/presets creates a preset", async () => {
    const res = await request(app).post("/api/presets").send({
      name: "HIIT",
      workoutDuration: 30,
      breakDuration: 10,
      rounds: 8,
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe("HIIT");
    createdId = res.body.id;
  });

  it("POST /api/presets validates input", async () => {
    const res = await request(app)
      .post("/api/presets")
      .send({ name: "", workoutDuration: -1, breakDuration: 0, rounds: 0 });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("GET /api/presets/:id returns the preset", async () => {
    const res = await request(app).get(`/api/presets/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  it("GET /api/presets/:id returns 404 for unknown id", async () => {
    const res = await request(app).get("/api/presets/nonexistent");
    expect(res.status).toBe(404);
  });

  it("DELETE /api/presets/:id deletes the preset", async () => {
    const res = await request(app).delete(`/api/presets/${createdId}`);
    expect(res.status).toBe(204);
  });

  it("DELETE /api/presets/:id returns 404 after deletion", async () => {
    const res = await request(app).delete(`/api/presets/${createdId}`);
    expect(res.status).toBe(404);
  });
});
