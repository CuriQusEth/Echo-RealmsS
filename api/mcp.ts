import { VercelRequest, VercelResponse } from '@vercel/node';

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

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Echo Realms MCP Endpoint",
      status: "active",
      description: "Active MCP server for Echo Realms Orchestrator Agent",
      capabilities: ["multi-realm-management", "echo-mechanics", "game-automation"],
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
      const { method, params, id } = body;

      if (method === 'initialize') {
        return res.status(200).json({
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
        return res.status(200).json({
          jsonrpc: "2.0",
          id,
          result: { tools: TOOLS }
        });
      }

      if (method === 'tools/call') {
        return res.status(200).json({
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
        return res.status(200).json({ jsonrpc: "2.0", id, result: { prompts: [] } });
      }

      if (method === 'resources/list') {
        return res.status(200).json({ jsonrpc: "2.0", id, result: { resources: [] } });
      }

      return res.status(200).json({
        jsonrpc: "2.0",
        id,
        error: { code: -32601, message: "Method not found" }
      });
    } catch (error) {
      return res.status(400).json({ error: "Invalid MCP request" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
