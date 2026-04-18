# MCP Servers

Adding MCP servers in VS Code:
Gear in top right of chat window > MCP Servers > plus button in top right > Command (stdio)

Adding MCP servers in CLI: `/mcp add`


## Playwright

Playwright MCP repo: https://github.com/microsoft/playwright-mcp

**VS Code values:**

*Command:* `npx @playwright/mcp@latest`

*Name:* playwright

*Location:* Workspace


**CLI values:**

*Unique name:* playwright

*Server type:* STDIO

*Command:* `npx @playwright/mcp@latest`

*Environment variables:* none

*Tools:* *


## Context7

Context7 repo: https://github.com/upstash/context7
Context7 site: https://context7.com/

**VS Code values:**

*Command:* `npx`

*Args:* `-y @upstash/context7-mcp`

*Name:* context7

*Location:* Workspace


**CLI values:**

*Unique name:* context7

*Server type:* STDIO

*Command:* `npx -y @upstash/context7-mcp`

*Environment variables:* none

*Tools:* *

## Context7 prompt

```
Add to the copilot instructions to use context7 with the `vitejs/vite` library whenever it needs to learn how to use Vite features
```