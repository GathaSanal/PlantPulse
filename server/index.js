
import { createServer } from "node:http";
import process from "node:process";
import { Buffer } from "node:buffer";

const HOST = "127.0.0.1";
const PORT = 3001;

const BIN_ID = process.env.JSONBIN_BIN_ID;
const ACCESS_KEY = process.env.JSONBIN_ACCESS_KEY;

if (!BIN_ID || !ACCESS_KEY) {
  throw new Error("Missing JSONBin credentials in .env.local");
}

const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

function sendJSON(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  });

  res.end(JSON.stringify(data));
}

const server = createServer(async (req, res) => {
  // Allow requests only from the local application.
  const origin = req.headers.origin;

  const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return sendJSON(res, 403, {
      error: "Origin not allowed"
    });
  }

  // Restrict requests to the PlantPulse endpoint.
  const path = new URL(
    req.url,
    `http://${HOST}:${PORT}`
  ).pathname;

  if (path !== "/api/plant") {
    return sendJSON(res, 404, {
      error: "Not found"
    });
  }

  // Only GET and PUT are supported.
  if (!["GET", "PUT"].includes(req.method)) {
    res.setHeader("Allow", "GET, PUT");

    return sendJSON(res, 405, {
      error: "Method not allowed"
    });
  }

  // Additional browser protection for updates.
  if (req.method === "PUT") {
    if (!origin || !allowedOrigins.includes(origin)) {
      return sendJSON(res, 403, {
        error: "Update origin not allowed"
      });
    }

    if (
      !req.headers["content-type"]?.startsWith(
        "application/json"
      )
    ) {
      return sendJSON(res, 415, {
        error: "Content-Type must be application/json"
      });
    }
  }

  try {
    // GET: Retrieve existing PlantPulse data.
    if (req.method === "GET") {
      const response = await fetch(
        `${BIN_URL}/latest`,
        {
          headers: {
            "X-Access-Key": ACCESS_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(
          `JSONBin GET failed: ${response.status}`
        );
      }

      const data = await response.json();

      return sendJSON(res, 200, data.record);
    }

    // PUT: Read the incoming JSON request.
    const chunks = [];
    let totalBytes = 0;

    for await (const chunk of req) {
      totalBytes += chunk.length;

      if (totalBytes > 200000) {
        return sendJSON(res, 413, {
          error: "Payload too large"
        });
      }

      chunks.push(chunk);
    }

    let body;

    try {
      body = JSON.parse(
        Buffer.concat(chunks).toString("utf8")
      );
    } catch {
      return sendJSON(res, 400, {
        error: "Invalid JSON"
      });
    }

    // Validate the PlantPulse data structure.
    if (
      !body ||
      !Array.isArray(body.systems) ||
      !Array.isArray(body.events)
    ) {
      return sendJSON(res, 400, {
        error: "Expected systems and events arrays"
      });
    }

    // PUT: Update only the existing JSONBin record.
    const response = await fetch(BIN_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Access-Key": ACCESS_KEY
      },
      body: JSON.stringify({
        systems: body.systems,
        events: body.events
      })
    });

    if (!response.ok) {
      throw new Error(
        `JSONBin PUT failed: ${response.status}`
      );
    }

    return sendJSON(res, 200, {
      saved: true
    });

  } catch (error) {
    console.error(
      "PlantPulse backend error:",
      error.message
    );

    return sendJSON(res, 502, {
      error: "JSONBin request failed"
    });
  }
});

// Listen only on this computer.
server.listen(PORT, HOST, () => {
  console.log(
    `PlantPulse backend: http://${HOST}:${PORT}`
  );
});
