# Echo Realms

**Echo Realms** is a beautiful, atmospheric puzzle-adventure game where you explore mysterious interconnected realms using **sound echoes**. You are an Echo Walker who can send sound waves that bounce through the environment, revealing hidden paths, activating mechanisms, and solving puzzles.

## Game Features

- **Echo Mechanics:** Tap to send a pulse that reveals the hidden environment.
- **On-Chain Identity Check:** Authenticate using Web3 wallets directly on Base Mainnet.
- **ERC-8004 AI Agents:** Fully integrated Trustless autonomous AI agents managing game automation, multi-realm synchronization, and daily operations.
- **ERC-8021:** Fully integrated game transactions and score completions.
- **Mobile First:** Designed to be played on mobile devices with intuitive touch controls.
- **Atmospheric Visuals:** Handcrafted aesthetics with ambient, responsive background visuals and audio.

## Web3 Integrations

- **Agent Orchestrator:** This game hosts a live `.well-known/agent-card.json` configuration exposing the **Echo Realms Orchestrator** for full ERC-8004 discoverability and connections.
- **Model Context Protocol (MCP):** Connect to `/api/mcp` to issue commands to the orchestrator.
- **On-Chain Leaderboards:** Submit your furthest reach directly on Base.

## Connecting via MCP

The **Echo Realms Orchestrator** is built to run as a Model Context Protocol (MCP) server. To interact with it:

1. Send a `POST` request to `/api/mcp` with Standard MCP JSON-RPC methods (e.g., `initialize`, `tools/list`, `tools/call`).
2. Tools supported in the current implementation include core operations like `get_race_status`, `start_race`, `get_leaderboard`, `optimize_speed`, and `get_track_info`.
3. The server responds with standardized JSON formatted using `NextResponse`.

## How to Run Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Build the Application:**
   ```bash
   npm run build
   ```

## Tech Stack

- React 19 + Vite
- Next.js 14 App Router format (for APIs `app/api/mcp` & `app/api/agent`)
- Canvas API for High-Performance Rendering
- Framer Motion for UI Animations
- Wagmi + Viem for Web3/Base connection
- Zustand for State Management