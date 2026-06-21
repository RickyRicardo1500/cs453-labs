import { describe, expect, test } from "vitest";
import request from "supertest";
import { createApp } from "../src/server.js";

let nextId = 3;
let items = [
  { id: 1, name: "keyboard", quantity: 10 },
  { id: 2, name: "mouse", quantity: 5 }
];

describe("Lab 3 starter", () => {
  test("GET /health returns status ok", async () => {
    const app = createApp();

    const response = await request(app)
        .get("/health")
        .expect(200);

    expect(response.body).toEqual({ status: "ok" });
  });

  test("GET /items returns items", async () => {
    const app = createApp();

    const response = await request(app)
        .get("/items")
        .expect(200);

    expect(response.body).toEqual(items);
  });

  test("POST /items returns new item", async () => {
    const app = createApp();

    const response = await request(app)
        .post("/items")
        .expect(201);

    expect(response.body).toEqual({ status: "ok" });
  });

  test("GET /items/:id returns item", async () => {
    const app = createApp();

    const response = await request(app)
        .get("/items/:id")
        .expect(200);

    expect(response.body).toEqual(items);
  });

  test("PUT /items/:id returns updated item", async () => {
    const app = createApp();

    const response = await request(app)
        .put("/items/:id")
        .expect(200);

    expect(response.body).toEqual(item);
  });

  test("DELETE /health returns status ok", async () => {
    const app = createApp();

    const response = await request(app)
        .delete("/items/:id")
        .expect(204);

    expect(response.body).toEqual({ status: "deleted" });
  });

});