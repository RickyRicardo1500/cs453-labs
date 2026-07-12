# Lab 5 Starter

## How to Run

```bash
npm install
docker compose up -d
npm run api
npm run client
```

Open:

```text
http://localhost:5173
```

Postgres is exposed on:

```text
postgres://postgres:postgres@localhost:5433/lab05
```

## What Already Works

- Postgres runs in Docker.
- The Express server connects to Postgres.
- The server creates and seeds an `items` table on startup.
- `GET /health`, `GET /api/items`, and `POST /api/items` are implemented.
- The browser client can load items and add a new item.

## What You Need to Add

- `GET /api/items/:id`
- `PUT /api/items/:id`
- `PATCH /api/items/:id`
- `DELETE /api/items/:id`
- Better validation and error handling
- Client-side UI for at least some of the new routes

## Graduate Extension

Add one more resource or relationship, such as categories, projects, or tags,
and connect it to the database.

Remember to delete and recreate the database container because the previous tables before adding the relationships are still stored. An error 500 will be received otherwise.

```bash
docker compose down -v
docker compose up -d
```


## Reflection Answers

### 1. What changed when the API moved from in-memory data to Postgres?

When the API moved from in-memory data to Postgres, the items were stored permanently in a database instead of being stored only while the server was running. With in-memory storage, all data would be lost whenever the server restarted. With Postgres, the data remains available after restarting the API or client. The API also had to use SQL queries and asynchronous database operations to create, read, update, and delete items.

### 2. When should you use `PUT` instead of `PATCH`?

PUT should be used when replacing the entire resource with a complete new version. The request should include all required fields for the item, such as the name, quantity, and category. PATCH should be used when only changing one or more specific fields while leaving the other fields unchanged.

### 3. What kinds of validation belong in the API even if the browser client also validates input?

The API should validate all route parameters and request body values. It should verify that the item ID is a positive integer, the name and category are non-empty strings, and the quantity is a non-negative integer. The API should also reject missing required fields, invalid data types, and empty update requests. Server-side validation is still necessary because clients other than the browser, such as curl or another application, can send requests directly to the API.

### 4. How does the browser client help you test the API differently than `curl` alone?

The browser client helps test the complete interaction between the user interface, JavaScript, API, CORS configuration, and database. It shows whether forms submit correctly, whether fetch requests use the correct routes and methods, and whether the displayed item list updates after a database change. curl is useful for testing individual API endpoints directly, but it does not test the browser interface or client-side JavaScript behavior.

### 5. If you added an extension, what did you add and why?

I added a category field to the item resource. Each item now includes an ID, name, quantity, and category. I updated the database schema, API routes, validation, SQL queries, browser forms, and item display to support categories. I added this extension so that inventory items can be organized into groups such as Peripheral or Display, making the application more useful and demonstrating how a database-backed resource can be expanded.
