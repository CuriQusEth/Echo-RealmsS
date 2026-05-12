import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // AI Agent & MCP Integration Endpoints
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Echo Realms MCP Endpoint",
      status: "active",
      description: "Active MCP server for Echo Realms Orchestrator Agent",
      capabilities: ["multi-realm-management", "echo-mechanics", "game-automation"],
      timestamp: new Date().toISOString()
    });
  });

  app.post("/api/mcp", (req, res) => {
    try {
      res.json({
        status: "success",
        message: "MCP command received",
        agent: "Echo Realms Orchestrator",
        receivedAt: new Date().toISOString(),
        payload: req.body
      });
    } catch (error) {
      res.status(400).json({ error: "Invalid MCP request" });
    }
  });

  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Echo Realms Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Echo Realms",
      version: "1.0.0"
    });
  });

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
