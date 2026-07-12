import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const PORT = process.env.PORT || 3000;

const pool = new Pool({
  host: process.env.PGHOST ?? "127.0.0.1",
  port: Number(process.env.PGPORT ?? 5433),
  database: process.env.PGDATABASE ?? "lab05",
  user: process.env.PGUSER ?? "postgres",
  password: process.env.PGPASSWORD ?? "postgres"
});

function parseItemId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}

function validateItem(nameValue, quantityValue, categoryValue) {
  const name =
    typeof nameValue === "string"
      ? nameValue.trim()
      : "";

  const quantity = Number(quantityValue);

  const category =
    typeof categoryValue === "string"
      ? categoryValue.trim()
      : "";

  if (!name) {
    return {
      valid: false,
      message: "A non-empty name is required."
    };
  }
  if (!Number.isInteger(quantity) || quantity < 0) {
    return {
      valid: false,
      message: "Quantity must be a non-negative integer."
    };
  }
  if (!category) {
    return {
      valid: false,
      message: "A non-empty category is required."
    };
  }
  return {
    valid: true,
    name,
    quantity,
    category
  };
}


export function createApp() {
  const app = express();

  app.use(express.json());

  app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ]
  }));

  app.get("/health", async (req, res) => {
    try {
      await pool.query("SELECT 1");
      res.json({ status: "ok" });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "error",
        message: "Database connection failed."
      });
    }
  });

  // Starter route: return every item from the database.
  app.get("/api/items", async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT id, name, quantity, category
        FROM items
        ORDER BY id ASC
      `);

      res.json({ items: result.rows });
    } catch (error) {
      console.error("Failed to load items:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load items."
      });
    }
  });

  // Starter route: create one item so the client can demonstrate a write.
  app.post("/api/items", async (req, res) => {
    const name = req.body?.name?.trim();
    const quantity = Number(req.body?.quantity);
    const category = req.body?.category?.trim();

    if (!name || !Number.isInteger(quantity) || quantity < 0 || !category) {
      return res.status(400).json({
        error: "Bad Request",
        message: "A name, category, and non-negative integer quantity are required."
      });
    }

    try {
      const result = await pool.query(
        `
          INSERT INTO items (name, quantity, category)
          VALUES ($1, $2, $3)
          RETURNING id, name, quantity, category
        `,
        [name, quantity, category]
      );

      res.status(201).json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to add item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to add item."
      });
    }
  });

  // COMPLETED: Return one item by ID.
  app.get("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);
    try {
      const result = await pool.query(
      `
        SELECT id, name, quantity, category
        FROM items
        WHERE id = $1 
      `,
      [id]);

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: `Item with ID ${id} was not found.`
        });
      }
      res.json({ item: result.rows[0] });
    } catch (error) {
      console.error("Failed to load item:", error);
      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to load item by id."
      });
    }
  });

  // COMPLETED: Replace one item by ID.
  app.put("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Item ID must be a positive integer."
      });
    }

    const validation = validateItem(
      req.body?.name,
      req.body?.quantity,
      req.body?.category
    );

    if (!validation.valid) {
      return res.status(400).json({
        error: "Bad Request",
        message: validation.message
      });
    }

    try {
      const result = await pool.query(
        `
          UPDATE items
          SET name = $1,
              quantity = $2,
              category = $3
          WHERE id = $4
          RETURNING id, name, quantity, category
        `,
        [
          validation.name,
          validation.quantity,
          validation.category,
          id
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: `Item with ID ${id} was not found.`
        });
      }

      res.json({
        item: result.rows[0]
      });
    } catch (error) {
      console.error("Failed to replace item:", error);

      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to replace item."
      });
    }
  });

  // COMPLETED: Partially update one item by ID.
  app.patch("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Item ID must be a positive integer."
      });
    }

    const hasName = Object.prototype.hasOwnProperty.call(
      req.body ?? {},
      "name"
    );

    const hasQuantity = Object.prototype.hasOwnProperty.call(
      req.body ?? {},
      "quantity"
    );

    const hasCategory = Object.prototype.hasOwnProperty.call(
      req.body ?? {},
      "category"
    );

    if (!hasName && !hasQuantity && !hasCategory) {
      return res.status(400).json({
        error: "Bad Request",
        message:
          "Provide at least one field to update: name, category, or quantity."
      });
    }

    let name = null;
    let quantity = null;
    let category = null;

    if (hasName) {
      if (typeof req.body.name !== "string") {
        return res.status(400).json({
          error: "Bad Request",
          message: "Name must be a string."
        });
      }

      name = req.body.name.trim();

      if (!name) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Name must not be empty."
        });
      }
    }

    if (hasQuantity) {
      quantity = Number(req.body.quantity);

      if (!Number.isInteger(quantity) || quantity < 0) {
        return res.status(400).json({
          error: "Bad Request",
          message:
            "Quantity must be a non-negative integer."
        });
      }
    }

    if (hasCategory) {
      if (typeof req.body.category !== "string") {
        return res.status(400).json({
          error: "Bad Request",
          message: "Category must be a string."
        });
      }

      category = req.body.category.trim();

      if (!category) {
        return res.status(400).json({
          error: "Bad Request",
          message: "Category must not be empty."
        });
      }
    }

    try {
      const result = await pool.query(
        `
          UPDATE items
          SET name = CASE
                WHEN $1::boolean THEN $2
                ELSE name
              END,
              quantity = CASE
                WHEN $3::boolean THEN $4
                ELSE quantity
              END,
              category = CASE
                WHEN $5::boolean THEN $6
                ELSE category
              END
          WHERE id = $7
          RETURNING id, name, quantity, category
        `,
        [
          hasName,
          name,
          hasQuantity,
          quantity,
          hasCategory,
          category,
          id
        ]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: `Item with ID ${id} was not found.`
        });
      }

      res.json({
        item: result.rows[0]
      });
    } catch (error) {
      console.error("Failed to update item:", error);

      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to update item."
      });
    }
  });

  // COMPLETED: Delete one item by ID.
  app.delete("/api/items/:id", async (req, res) => {
    const id = parseItemId(req.params.id);

    if (id === null) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Item ID must be a positive integer."
      });
    }
    
    try {
      const result = await pool.query(
        `
          DELETE FROM items
          WHERE id = $1
          RETURNING id, name, quantity, category
        `,
        [id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          error: "Not Found",
          message: `Item with ID ${id} was not found.`
        });
      }

      res.json({
        message: "Item deleted successfully.",
        item: result.rows[0]
      });
    } catch (error) {
      console.error("Failed to delete item:", error);

      res.status(500).json({
        error: "Internal Server Error",
        message: "Failed to delete item."
      });
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: "Not found" });
  });

  return app;
}

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity >= 0),
      category TEXT NOT NULL
    )
  `);

  const { rows } = await pool.query("SELECT COUNT(*)::int AS count FROM items");

  if (rows[0].count === 0) {
    await pool.query(
      `
        INSERT INTO items (name, quantity, category)
        VALUES ($1, $2, $3), ($4, $5, $6), ($7, $8, $9)
      `,
      ["Keyboard", 10, "Peripheral", "Mouse", 5, "Peripheral", "Monitor", 3, "Display"]
    );
  }
}

const isMainModule = process.argv[1] === new URL(import.meta.url).pathname;

if (isMainModule) {
  const app = createApp();

  initializeDatabase()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Lab 5 API listening on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error);
      process.exit(1);
    });
}
