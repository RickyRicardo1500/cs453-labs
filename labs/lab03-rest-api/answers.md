# Lab 3 - REST API with Express

## Reflection Questions

Answer the following questions in your submission:

1. What makes this API more "REST-like" than the previous HTTP/JSON lab?

This API is more REST-like because it uses resource-based routes such as /items and /items/:id, along with standard HTTP methods like GET, POST, PUT, and DELETE to perform CRUD operations. This makes the API more structured and easier to understand.

2. What is the purpose of a route parameter such as `/items/:id`?

A route parameter allows the server to identify a specific resource using a dynamic value in the URL. In this case, :id represents the ID of a specific item so the server can retrieve, update, or delete that item.

3. Why should `POST`, `PUT`, and `DELETE` use different HTTP methods?

Each HTTP method represents a different action. POST creates new resources, PUT updates existing resources, and DELETE removes resources. Using different methods makes the API behavior clear and follows REST conventions.

4. What is the difference between a `400` error and a `404` error?

A 400 Bad Request error means the client sent invalid or malformed data, such as missing required fields. A 404 Not Found error means the requested resource does not exist.

5. How does the OpenAPI file relate to your Express server code?

The OpenAPI file documents the API by describing its routes, request formats, response formats, and possible errors. It serves as a blueprint for how the Express server should behave and helps developers understand and test the API.

