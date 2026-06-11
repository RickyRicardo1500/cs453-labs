import http from "node:http";

const DEFAULT_PORT = 3000;

let requestCount = 0;

export function sendJson(res, statusCode, body) {
    res.writeHead(statusCode, {
        "Content-Type": "application/json"
    });

    res.end(JSON.stringify(body));
}

export function readJsonBody(req) {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            if (body.trim() === "") {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(body));
            } catch {
                reject(new Error("Invalid JSON"));
            }
        });

        req.on("error", reject);
    });
}

export function handleCalculate(body) {
    // COMPLETED: Validate that operation, a, and b are present.
    // COMPLETED: Validate that a and b are numbers.
    // COMPLETED: Support add, subtract, multiply, and divide.
    // COMPLETED: Return an error for unsupported operations.
    // COMPLETED: Return an error for division by zero.
    const { operation, a, b } = body;
    let c = 0;
    let stat = 200;
    let result = "result";
    let err_text = "";

    if (a === undefined || b === undefined || operation === undefined) {
        stat = 400;
        result = "error";
        err_text = "Not Found - a, b, or operation not present";
    } else if (typeof a !== "number" || typeof b != "number" ) {
        stat = 400;
        result = "error";
        err_text = "Bad Request - a or b not a number";
    } else if (b === 0) {
        stat = 400;
        result = "error";
        err_text = "Division by Zero";
    } else {
        if (operation === "add") {
            c = a + b;
        } else if (operation === "subtract") {
            c = a - b;
        } else if (operation === "multiply") {
            c = a * b;
        } else if (operation === "divide") {
            c = a / b;
        } else if (operation === "remainder") {  //GRADUATE, additional operation
            c = a % b;
        } else {
            stat = 400;
            result = "error";
            err_text = "Bad Request - unsupported operation";
        }
    }

    if (stat === 200) {
        return {
            statusCode: stat,
            response: {
                result: c
            }
        };
    } else {
        return {
            statusCode: stat,
            response: {
                error: err_text
            }
        };
    }

    
}

export async function requestHandler(req, res) {
    requestCount += 1;

    const method = req.method;
    const url = req.url;

    if (method === "GET" && url === "/health") {
        sendJson(res, 200, { status: "ok" });
        return;
    }

    if (method === "GET" && url === "/requests") {
        // COMPLETED: Return the current request count as JSON.
        sendJson(res, 200, { count: requestCount });
        return;
    }

    if (method === "POST" && url === "/echo") {
        try {
            const body = await readJsonBody(req);

            // COMPLETED: Return the parsed JSON body back to the client.
            sendJson(res, 200, body);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    if (method === "POST" && url === "/calculate") {
        try {
            const body = await readJsonBody(req);
            const result = handleCalculate(body);

            sendJson(res, result.statusCode, result.response);
        } catch {
            sendJson(res, 400, { error: "Invalid JSON" });
        }

        return;
    }

    sendJson(res, 404, { error: "Not found" });
}

export function createServer() {
    return http.createServer(requestHandler);
}

export function resetState() {
    requestCount = 0;
}

if (import.meta.url === `file://${process.argv[1]}`) {
    const port = process.env.PORT || DEFAULT_PORT;
    const server = createServer();

    server.listen(port, () => {
        console.log(`HTTP JSON server listening on port ${port}`);
    });
}