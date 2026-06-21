import express from "express";

export function createApp() {
  const app = express();

  app.use(express.json());

  // Starter data. This data is stored in memory and will reset when the
  // server restarts.
  let nextId = 3;
  const items = [
    { id: 1, name: "keyboard", quantity: 10 },
    { id: 2, name: "mouse", quantity: 5 }
  ];

  function isValidItem(body) {
    return (
      body &&
      typeof body.name === "string" &&
      body.name.trim() !== "" &&
      typeof body.quantity === "number" &&
      body.quantity >= 0
    );
  }

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Completed: Return all items.
  app.get("/items", (req, res) => {
    res.json(items);
  });

  // Completed: Return one item by ID.
  app.get("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const item = items.find(item => item.id === id);
    if (!item) {
      res.status(404).json({ error: "Item not found" });
    }
    else {
      res.json(item)
    }    
  });

  // Completed: Create a new item.
  app.post("/items", (req, res) => {
    if (!isValidItem(req.body)) {
      return res.status(400).json({ error: "Missing required fields or contains invalid data" });
    }

    const newItem = {
      id: nextId++,
      name: req.body.name,
      quantity: req.body.quantity
    };

    items.push(newItem);
    res.status(201).json(newItem);
  });

  // TODO: Update an existing item.
  app.put("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    if (!isValidItem(req.body)) {
      return res.status(400).json({ error: "Missing required fields or contains invalid data" });
    }

    items[index] = {
      id,
      name: req.body.name,
      quantity: req.body.quantity
    };

    res.json(items[index]);
  });

  // TODO: Delete an existing item.
  app.delete("/items/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Item not found" });
    }

    items.splice(index, 1);
    res.status(204).send();
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const PORT = process.env.PORT || 3000;
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`Lab 3 REST API listening on port ${PORT}`);
  });
}
