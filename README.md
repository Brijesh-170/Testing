My name is Brijesh Rajput

# Model Context Protocol (MCP)

## 📌 What is MCP?

**MCP (Model Context Protocol)** is an **open standard/protocol** introduced by **Anthropic** that defines a universal way for **AI applications (LLMs)** to connect with **external data sources, tools, and systems**.

Think of MCP as the **"USB-C for AI applications"** — instead of building custom, one-off integrations between every AI app and every data source/tool, MCP provides a **standardized interface** so any MCP-compatible AI client can talk to any MCP-compatible server.

---

## 🎯 Why MCP Was Created (The Problem It Solves)

Before MCP, connecting an LLM to external systems (databases, APIs, file systems, SaaS tools, etc.) required **custom integration code for every single combination** of AI app + data source. This led to:

- 🔁 Duplicate integration work across teams/companies
- 🔒 Vendor lock-in (integrations tied to one AI provider)
- 🧩 Fragmented, inconsistent ways of exposing tools/data to AI
- ⏳ Slower development of AI-powered applications

**MCP solves this** by providing a **single, standardized protocol** that any AI application can use to discover and interact with any external tool or data source.

---

## 🏗️ Core Architecture

MCP follows a **Client-Server architecture**, similar in spirit to the Language Server Protocol (LSP) used in code editors.

```
┌─────────────┐        MCP Protocol        ┌─────────────┐
│  MCP Host   │ ─────────────────────────► │  MCP Server │
│ (AI App /   │ ◄───────────────────────── │ (Tool/Data  │
│  LLM Client)│                            │  Provider)  │
└─────────────┘                            └─────────────┘
```

### 1. **Host**
The AI application itself (e.g., Claude Desktop, an IDE, a custom chatbot) that wants to access external context. The Host manages one or more Clients.

### 2. **Client**
Lives inside the Host application. It maintains a **1:1 connection** with an MCP Server and handles the protocol-level communication.

### 3. **Server**
A lightweight program that exposes specific capabilities (tools, resources, prompts) to the Client. Servers can:
- Run **locally** (on the same machine, via stdio)
- Run **remotely** (over HTTP/SSE, as a hosted service)

Examples of MCP Servers: GitHub server, Slack server, Google Drive server, PostgreSQL server, filesystem server, custom internal API servers, etc.

---

## 🔑 Core Primitives / Building Blocks of MCP

MCP defines a few key primitives that Servers can expose to Clients:

| Primitive     | Description                                                                 | Controlled By |
|---------------|------------------------------------------------------------------------------|---------------|
| **Tools**     | Executable functions the LLM can call (e.g., `send_email`, `run_query`)      | Model (AI decides when to call) |
| **Resources** | Read-only data/context the app can fetch (e.g., a file, a DB record, a doc)  | Application/User |
| **Prompts**   | Reusable, pre-defined prompt templates for common tasks                      | User |
| **Sampling**  | Allows a Server to ask the Host's LLM to generate a completion (agentic behavior) | Server-initiated |
| **Roots**     | Define the boundaries/scope (e.g., which directories) a server can access    | Client |

---

## 🔌 Transport Mechanisms

MCP supports multiple transport layers for communication between Client and Server:

1. **stdio (Standard Input/Output)**
   - Used for **local** servers running as subprocesses.
   - Fast, simple, no network overhead.

2. **HTTP + SSE (Server-Sent Events)** / **Streamable HTTP**
   - Used for **remote** servers accessible over the network.
   - Supports streaming responses back to the client.

All communication is based on **JSON-RPC 2.0** as the underlying message format.

---

## ⚙️ How MCP Works (Step-by-Step Flow)

1. **Initialization** – Host launches/connects to an MCP Server; Client and Server exchange capabilities (handshake).
2. **Discovery** – Client asks the Server: "What tools/resources/prompts do you offer?"
3. **Context Provision** – Server responds with a list of available Tools, Resources, and Prompts.
4. **User/Model Interaction** – The LLM (with user approval, if required) decides to invoke a Tool or fetch a Resource.
5. **Execution** – Client sends a request to the Server to execute the Tool or fetch the Resource.
6. **Response** – Server performs the action (e.g., queries a database, calls an API) and returns the result.
7. **Integration** – The result is fed back into the LLM's context to generate a more informed, accurate response.

---

## 🧰 What Can You Build With MCP?

- **Custom Tool Servers** – Expose internal company APIs, databases, or SaaS tools to an AI assistant.
- **AI-powered IDE plugins** – Let an LLM read/write files, run tests, or query docs directly in an editor.
- **Data connectors** – Connect LLMs to Postgres, MongoDB, Google Drive, Slack, GitHub, Notion, etc.
- **Agentic workflows** – Chain multiple MCP servers together for complex, multi-step automation.
- **Enterprise AI assistants** – Securely give LLMs access to internal knowledge bases and systems.

---

## 🌐 MCP Ecosystem

- **Official SDKs** available in multiple languages: **Python, TypeScript/JavaScript, Java, Kotlin, C#, Swift, Rust**, etc.
- **Pre-built Servers** maintained by Anthropic and the community for popular tools like:
  - GitHub, GitLab
  - Google Drive, Google Maps
  - Slack
  - PostgreSQL, SQLite
  - Filesystem
  - Puppeteer / Browser automation
  - Memory / Knowledge graph servers
- **Claude Desktop, Claude Code, and other AI apps** natively support MCP as clients.
- Growing adoption by other AI platforms and IDEs (e.g., Cursor, Windsurf, VS Code extensions) as MCP becomes an industry standard.

---

## ✅ Key Benefits of MCP

| Benefit               | Description |
|------------------------|-------------|
| **Standardization**    | One protocol works across many AI apps and tools — write once, use everywhere. |
| **Interoperability**   | Any MCP client can talk to any MCP server, regardless of vendor. |
| **Security & Control** | Users/Hosts control what data/tools the AI can access (permissions, roots, approvals). |
| **Extensibility**      | Easy to add new tools/resources without changing the AI application itself. |
| **Reusability**        | Server implementations can be shared and reused across different AI products. |
| **Reduced Dev Time**   | No more building custom integrations for every AI + tool combination. |

---

## 🧪 Simple Example (Conceptual)

```
User: "What's the weather in Mumbai and send it to my team on Slack."

1. Host (AI App) receives the user request.
2. LLM decides it needs a "get_weather" Tool → Client calls Weather MCP Server.
3. Weather Server returns: "32°C, Sunny"
4. LLM decides it needs a "send_slack_message" Tool → Client calls Slack MCP Server.
5. Slack Server posts the message to the specified channel.
6. AI App confirms to the user: "Done! Sent the weather update to your team."
```

---

## 📚 Official Resources

- **Website:** https://modelcontextprotocol.io
- **Specification:** https://spec.modelcontextprotocol.io
- **GitHub Organization:** https://github.com/modelcontextprotocol
- **Introduced by:** Anthropic (November 2024)

---

## 🏁 Summary

> **MCP is to AI applications what USB-C is to devices** — a universal, open standard connector that lets any AI model securely and consistently access external tools, data, and context, eliminating fragmented one-off integrations and enabling a rich, interoperable ecosystem of AI-powered applications.
