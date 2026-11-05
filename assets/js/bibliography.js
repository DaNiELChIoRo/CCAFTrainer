/**
 * Curated review resources per CCA-F content domain.
 * Shown on the results screen for any domain the user scored weakly on, and
 * (ranked by relevance) after each answer in Review mode.
 * Sources: official Claude / Claude Code docs, Anthropic Engineering, MCP.
 */
window.BIBLIOGRAPHY = {
  agentic: [
    { title: "Building effective agents (workflows vs agents)", source: "Anthropic Engineering", url: "https://www.anthropic.com/engineering/building-effective-agents" },
    { title: "How we built our multi-agent research system", source: "Anthropic Engineering", url: "https://www.anthropic.com/engineering/multi-agent-research-system" },
    { title: "Agent SDK overview", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/agent-sdk/overview" },
    { title: "Subagents", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/sub-agents" },
    { title: "Handling stop reasons (the agentic loop)", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons" },
    { title: "Hooks reference", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/hooks" },
    { title: "Sessions: resume and fork", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/agent-sdk/sessions" },
  ],
  toolsmcp: [
    { title: "Writing effective tools for agents", source: "Anthropic Engineering", url: "https://www.anthropic.com/engineering/writing-tools-for-agents" },
    { title: "Implement tool use (descriptions, tool_choice, errors)", source: "Claude Docs", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use" },
    { title: "Tool use overview", source: "Claude Docs", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview" },
    { title: "Connect Claude Code to tools via MCP (.mcp.json scopes)", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/mcp" },
    { title: "Model Context Protocol: architecture & primitives", source: "MCP", url: "https://modelcontextprotocol.io/docs/learn/architecture" },
    { title: "MCP tools specification (isError results)", source: "MCP", url: "https://modelcontextprotocol.io/specification/2025-06-18/server/tools" },
  ],
  claudecode: [
    { title: "Memory & CLAUDE.md hierarchy, imports, rules", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/memory" },
    { title: "Slash commands", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/slash-commands" },
    { title: "Agent Skills (SKILL.md)", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/skills" },
    { title: "Common workflows: plan mode, examples, test-driven iteration", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/common-workflows" },
    { title: "Headless mode (-p, --output-format)", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/headless" },
    { title: "Claude Code GitHub Actions", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/github-actions" },
    { title: "Settings & permissions", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/settings" },
  ],
  prompting: [
    { title: "Prompt engineering overview", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview" },
    { title: "Be clear and direct (explicit criteria)", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/be-clear-and-direct" },
    { title: "Multishot (few-shot) prompting", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting" },
    { title: "Structured outputs (JSON schemas)", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs" },
    { title: "Message Batches (batch processing)", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/batch-processing" },
    { title: "Chain complex prompts", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/chain-prompts" },
  ],
  context: [
    { title: "Effective context engineering for AI agents", source: "Anthropic Engineering", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
    { title: "Context windows", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/context-windows" },
    { title: "Prompt caching", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-caching" },
    { title: "Long context prompting tips", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips" },
    { title: "Errors & rate limits (backoff, retry-after)", source: "Claude Docs", url: "https://platform.claude.com/docs/en/api/errors" },
    { title: "Reduce hallucinations (citations, provenance)", source: "Claude Docs", url: "https://platform.claude.com/docs/en/test-and-evaluate/strengthen-guardrails/reduce-hallucinations" },
  ],
};
