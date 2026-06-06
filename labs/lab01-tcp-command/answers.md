# Lab 1 - TCP Command Server

## Reflection Questions

Answer the following questions in your submission:

1. What is the difference between the client and the server?

    A client initiates communication and sends requests to the server. A server waits for requests and sends responses to clients by applying logic or resources accessible by the server.
    
2. Why does the server need to keep running after handling one request?

    The server is continuosly listening to respond to additional requests as they come in. There also may be other clients that need to connect to the server after the first request.

3. What happens if two clients connect at the same time?

    If two client are connected to the server, the server creates a separate socket connection for each client while still listening on the main port. The server can then communicate with each client independently without mixing their messages.

4. How is this different from HTTP?

    HTTP is a standardized application-layer protocol that sends structured requests and responses with defined methods, headers, status codes, and message formats. This command server utilizes a custom text-based protocol sent over a TCP connection that is maintained until disconnected. 

