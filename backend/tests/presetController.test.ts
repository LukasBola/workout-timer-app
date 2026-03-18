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

  describe("POST /api/presets - validation - negative cases", () => {
    it("rejects missing fields", async () => {
      const res = await request(app).post("/api/presets").send({});
      expect(res.status).toBe(400);
      const paths = res.body.errors.map((e: { path: string[] }) => e.path[0]);
      expect(paths).toContain("name");
      expect(paths).toContain("workoutDuration");
      expect(paths).toContain("breakDuration");
      expect(paths).toContain("rounds");
    });

    it("rejects empty name string", async () => {
      const res = await request(app)
        .post("/api/presets")
        .send({ name: "", workoutDuration: 30, breakDuration: 10, rounds: 5 });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].path[0]).toBe("name");
    });

    it("rejects name longer than 100 characters", async () => {
      const res = await request(app)
        .post("/api/presets")
        .send({ name: "a".repeat(101), workoutDuration: 30, breakDuration: 10, rounds: 5 });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].path[0]).toBe("name");
    });

    it("rejects workoutDuration = 0", async () => {
      const res = await request(app)
        .post("/api/presets")
        .send({ name: "Test", workoutDuration: 0, breakDuration: 10, rounds: 5 });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].path[0]).toBe("workoutDuration");
    });

    it("rejects workoutDuration > 3600", async () => {
      const res = await request(app)
        .post("/api/presets")
        .send({ name: "Test", workoutDuration: 3601, breakDuration: 10, rounds: 5 });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].path[0]).toBe("workoutDuration");
    });

    it("rejects rounds > 100", async () => {
      const res = await request(app)
        .post("/api/presets")
        .send({ name: "Test", workoutDuration: 30, breakDuration: 10, rounds: 101 });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].path[0]).toBe("rounds");
    });

    it("rejects fractional workoutDuration", async () => {
      const res = await request(app)
        .post("/api/presets")
        .send({ name: "Test", workoutDuration: 30.5, breakDuration: 10, rounds: 5 });
      expect(res.status).toBe(400);
      expect(res.body.errors[0].path[0]).toBe("workoutDuration");
    });
  });

  describe("POST /api/presets - validation - positive cases", () => {
    it("accepts minimum valid values", async () => {
      const res = await request(app)
        .post("/api/presets")
        .send({ name: "A", workoutDuration: 1, breakDuration: 1, rounds: 1 });
      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
    });

    it("accepts maximum valid values", async () => {
      const res = await request(app)
        .post("/api/presets")
        .send({ name: "a".repeat(100), workoutDuration: 3600, breakDuration: 3600, rounds: 100 });
      expect(res.status).toBe(201);
      expect(res.body.id).toBeDefined();
    });

    it("trims whitespace from name", async () => {
      const res = await request(app)
        .post("/api/presets")
        .send({ name: "  Trening  ", workoutDuration: 30, breakDuration: 10, rounds: 5 });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Trening");
    });
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
