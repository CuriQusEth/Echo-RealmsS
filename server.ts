import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Add broad CORS for API routes specifically
  app.use("/api", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });
  app.use("/app/api", (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  const TOOLS = [
    {
      name: "get_race_status",
      description: "Get the current status of a race",
      inputSchema: { type: "object", properties: { raceId: { type: "string" } }, required: ["raceId"] }
    },
    {
      name: "start_race",
      description: "Start a new race",
      inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
    },
    {
      name: "get_leaderboard",
      description: "Get the race leaderboard",
      inputSchema: { type: "object", properties: { raceId: { type: "string" } }, required: ["raceId"] }
    },
    {
      name: "optimize_speed",
      description: "Optimize vehicle speed",
      inputSchema: { type: "object", properties: { vehicleId: { type: "string" } }, required: ["vehicleId"] }
    },
    {
      name: "get_track_info",
      description: "Get info about a track",
      inputSchema: { type: "object", properties: { trackId: { type: "string" } }, required: ["trackId"] }
    }
  ];

  // AI Agent & MCP Integration Endpoints
  const handleMcpGet = (req: express.Request, res: express.Response) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Echo Realms MCP Endpoint",
      status: "active",
      description: "Active MCP server for Echo Realms Orchestrator Agent",
      capabilities: ["multi-realm-management", "echo-mechanics", "game-automation"],
      timestamp: new Date().toISOString()
    });
  };

  const handleMcpPost = (req: express.Request, res: express.Response) => {
    try {
      const body = req.body;
      const { id = null, method, params } = body || {};

      if (method === 'initialize') {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {}, prompts: {}, resources: {} },
            serverInfo: { name: "Echo Realms MCP Endpoint", version: "1.0.0" }
          }
        });
      }

      if (method === 'tools/list') {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: { tools: TOOLS }
        });
      }

      if (method === 'tools/call') {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: {
            content: [
              { type: "text", text: `Tool ${params?.name} executed successfully with params ${JSON.stringify(params?.arguments || {})}` }
            ],
            isError: false
          }
        });
      }

      if (method === 'prompts/list') {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: { prompts: [] }
        });
      }

      if (method === 'resources/list') {
        return res.json({
          jsonrpc: "2.0",
          id,
          result: { resources: [] }
        });
      }

      res.json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: "Method not found" }
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  };

  const handleAgentGet = (req: express.Request, res: express.Response) => {
    res.json({
      name: "Echo Realms Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Echo Realms",
      version: "1.0.0"
    });
  };

  const handleAgentPost = (req: express.Request, res: express.Response) => {
    try {
      res.json({
        status: "success",
        message: "Agent command received",
        payload: req.body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid agent request" });
    }
  };

  app.get("/api/mcp", handleMcpGet);
  app.post("/api/mcp", handleMcpPost);
  app.get("/app/api/mcp", handleMcpGet);
  app.post("/app/api/mcp", handleMcpPost);

  app.get("/api/agent", handleAgentGet);
  app.post("/api/agent", handleAgentPost);
  app.get("/app/api/agent", handleAgentGet);
  app.post("/app/api/agent", handleAgentPost);

  // Serve the well-known Agent Card manually
  app.get("/.well-known/agent-card.json", (req, res) => {
    try {
      const cardPath = path.join(process.cwd(), "public/.well-known/agent-card.json");
      const cardData = fs.readFileSync(cardPath, "utf-8");
      res.setHeader("Content-Type", "application/json");
      res.send(cardData);
    } catch (err) {
      res.status(404).json({ error: "Agent card not found" });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
