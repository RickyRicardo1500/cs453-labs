import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/server.js";

describe("Lab 3 starter", () => {
  test("GET /health returns status ok", async () => {
    const app = createApp();
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test("GET /items returns all items in list", async () => {
    const app = createApp();
    const res = await request(app).get("/items");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  test("GET /items/:id returns specified item in list", async () => {
    const app = createApp();
    const res = await request(app).get("/items/1");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      name: "keyboard",
      quantity: 10
    });
  });

  test("GET /items/:id returns 404 for missing item", async () => {
    const app = createApp();
    const res = await request(app).get("/items/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item not found" });
  });

  test("POST /items creates new item", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/items")
      .send({
        name: "monitor",
        quantity: 4
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      id: 3,
      name: "monitor",
      quantity: 4
    });
  });

  test("POST /items returns 400 for invalid input", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/items")
      .send({
        name: "",
        quantity: -1
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Missing required fields or contains invalid data" });
  });

  test("PUT /items/:id updates item in list", async () => {
    const app = createApp();
    const res = await request(app)
      .put("/items/1")
      .send({
        name: "mechanical keyboard",
        quantity: 12
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      id: 1,
      name: "mechanical keyboard",
      quantity: 12
    });
  });

  test("PUT /items/:id returns 404 for missing item", async () => {
    const app = createApp();
    const res = await request(app)
      .put("/items/999")
      .send({
        name: "test",
        quantity: 1
      });

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item not found" });
  });

  test("PUT /items/:id returns 400 for invalid input", async () => {
    const app = createApp();
    const res = await request(app)
      .put("/items/1")
      .send({
        name: "",
        quantity: -5
      });

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error: "Missing required fields or contains invalid data" });
  });

  test("DELETE /items/:id deletes item in list", async () => {
    const app = createApp();
    const res = await request(app).delete("/items/1");

    expect(res.statusCode).toBe(204);
  });

  test("DELETE /items/:id returns 404 for missing item", async () => {
    const app = createApp();
    const res = await request(app).delete("/items/999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toEqual({ error: "Item not found" });
  });
});