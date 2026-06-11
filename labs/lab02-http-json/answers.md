# Lab 2 - Hello HTTP + JSON


## Reflection Questions

Answer the following questions in your submission:

1. What is the difference between a TCP message and an HTTP request?

A TCP message is raw data sent over a TCP connection, while an HTTP request follows a standardized format that includes a method, path, headers, and optional body.

2. What does the `Content-Type: application/json` header tell the server?

The `Content-Type: application/json` header tells the server that the request body contains JSON data and should be parsed as JSON.

3. Why should a server return different HTTP status codes for different situations?

Different HTTP status codes help clients understand whether a request succeeded or why it failed.

4. What happens if the client sends invalid JSON?

If invalid JSON is sent, the server returns a `400 Bad Request` response with a JSON error message instead of crashing.

5. How is this lab different from Lab 1?

Lab 1 used a custom protocol over raw TCP sockets, while Lab 2 uses HTTP and JSON with standardized request and response formats.
