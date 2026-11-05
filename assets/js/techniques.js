/**
 * Exam blueprint & reference — a REFERENCE section, not a quiz.
 * The five CCA-F content domains, their exam weight, the task statements each
 * measures, and the six production scenarios exam items are framed around.
 * Reuses the "techniques" view: each item's `level` badge shows its task number.
 */
(function () {
  var D = {
    agents: { title: "Building effective agents", source: "Anthropic Engineering", url: "https://www.anthropic.com/engineering/building-effective-agents" },
    research: { title: "Multi-agent research system", source: "Anthropic Engineering", url: "https://www.anthropic.com/engineering/multi-agent-research-system" },
    stop: { title: "Handling stop reasons", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons" },
    subagents: { title: "Subagents", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/sub-agents" },
    hooks: { title: "Hooks reference", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/hooks" },
    sessions: { title: "Sessions", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/agent-sdk/sessions" },
    tools: { title: "Writing effective tools for agents", source: "Anthropic Engineering", url: "https://www.anthropic.com/engineering/writing-tools-for-agents" },
    impl: { title: "Implement tool use", source: "Claude Docs", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/implement-tool-use" },
    mcp: { title: "Claude Code MCP", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/mcp" },
    memory: { title: "Memory & CLAUDE.md", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/memory" },
    skills: { title: "Agent Skills", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/skills" },
    workflows: { title: "Common workflows", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/common-workflows" },
    headless: { title: "Headless mode", source: "Claude Code Docs", url: "https://code.claude.com/docs/en/headless" },
    clear: { title: "Be clear and direct", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/be-clear-and-direct" },
    fewshot: { title: "Multishot prompting", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/multishot-prompting" },
    structured: { title: "Structured outputs", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/structured-outputs" },
    batch: { title: "Batch processing", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/batch-processing" },
    context: { title: "Effective context engineering", source: "Anthropic Engineering", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" },
    longctx: { title: "Long context tips", source: "Claude Docs", url: "https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/long-context-tips" },
  };

  window.HACKER_TECHNIQUES = {
    disclaimer:
      "Unofficial study aid. The Claude Certified Architect — Foundations (CCA-F) exam has 60 scenario-based multiple-choice items (one correct answer, three distractors), a 120-minute limit, and a passing scaled score of 720 (100–1,000). Four of the six scenarios below are drawn at random for each sitting. Task statements are paraphrased; always confirm against the current Exam Guide in Anthropic Academy.",

    groups: [
      {
        title: "Domain 1 — Agentic Architecture & Orchestration (27%, largest)",
        items: [
          { name: "Agentic loops", level: "Task 1.1", what: "Run the loop on stop_reason: keep executing tools and appending tool_result while it is \"tool_use\"; stop on \"end_turn\". Add iteration/budget caps as a safety net, not as the primary stop signal.", why: "Parsing the assistant's text for \"I'm done\" or stopping at an arbitrary turn count are the classic wrong answers.", links: [D.stop] },
          { name: "Coordinator–subagent orchestration", level: "Task 1.2", what: "A hub-and-spoke coordinator decomposes the task, delegates, and synthesizes. All inter-agent communication routes through the coordinator for observability and consistent error handling.", why: "Narrow decomposition by the coordinator (not the subagents) is the usual root cause of incomplete coverage.", links: [D.research, D.agents] },
          { name: "Subagent invocation & context passing", level: "Task 1.3", what: "Subagents do not inherit the coordinator's history — pass everything they need explicitly in the prompt. Spawning requires the Task/Agent tool in allowedTools; emit independent subagent calls in one turn to run them in parallel.", why: "Shared-memory assumptions and missing context are the top subagent failure modes.", links: [D.subagents] },
          { name: "Enforcement & handoff", level: "Task 1.4", what: "When a step must happen (identity verification before a refund), enforce it programmatically — a prerequisite gate or hook — rather than relying on prompt instructions. Hand off to humans with a structured summary.", why: "Prompts are probabilistic; anything with financial or compliance impact needs a deterministic guarantee.", links: [D.hooks] },
          { name: "Agent SDK hooks", level: "Task 1.5", what: "PreToolUse hooks block or modify calls that violate policy (e.g. refunds above a threshold); PostToolUse hooks normalize tool output (dates, units, status codes) before the model sees it.", why: "Hooks give deterministic behavior; system-prompt rules only make compliance likely.", links: [D.hooks] },
          { name: "Task decomposition", level: "Task 1.6", what: "Fixed prompt chains for predictable multi-aspect work (e.g. per-file review then a cross-file pass); dynamic, adaptive decomposition for open-ended investigation.", why: "Pick the simplest pattern that reliably covers the task.", links: [D.agents] },
          { name: "Session state & resumption", level: "Task 1.7", what: "Resume a named session (--resume) when prior context is still valid; fork_session to explore alternatives from a shared baseline; start fresh with an injected summary when tool results are stale.", why: "Resuming with stale results silently misleads the agent.", links: [D.sessions] },
        ],
      },
      {
        title: "Domain 2 — Tool Design & MCP Integration (18%)",
        items: [
          { name: "Tool interfaces & descriptions", level: "Task 2.1", what: "Descriptions are the model's primary signal for tool choice. State purpose, input formats, examples, edge cases, and when to use it versus similar tools. Split or rename overlapping tools.", why: "Near-identical descriptions cause misrouting; fix the description before adding classifiers or few-shot.", links: [D.tools, D.impl] },
          { name: "Structured error responses", level: "Task 2.2", what: "Return isError with a category (transient, validation, business, permission), an isRetryable flag, and a human-readable message. Distinguish an access failure from a valid empty result.", why: "Generic \"operation failed\" errors prevent sensible recovery.", links: [D.impl] },
          { name: "Tool distribution & tool_choice", level: "Task 2.3", what: "Give each agent only the 4–5 tools its role needs. tool_choice: \"auto\" (may answer in text), \"any\" (must call some tool), or a forced specific tool to guarantee an ordered first step.", why: "Too many tools degrades selection; out-of-role tools invite misuse.", links: [D.impl] },
          { name: "MCP server integration", level: "Task 2.4", what: "Project-scoped servers in .mcp.json (version-controlled, shared) with ${ENV_VAR} expansion for secrets; personal servers in user scope (~/.claude.json). MCP resources expose catalogs/content without tool calls.", why: "Commit shared config, never commit tokens. Prefer existing community servers for standard integrations.", links: [D.mcp] },
          { name: "Built-in tools", level: "Task 2.5", what: "Grep searches file contents; Glob matches file paths; Read/Write/Edit for files (Edit needs a unique anchor — fall back to Read + Write); Bash for commands.", why: "Picking Grep vs Glob correctly is a frequent item.", links: [D.workflows] },
        ],
      },
      {
        title: "Domain 3 — Claude Code Configuration & Workflows (20%)",
        items: [
          { name: "CLAUDE.md hierarchy", level: "Task 3.1", what: "User (~/.claude/CLAUDE.md, personal, not shared), project (./CLAUDE.md or .claude/CLAUDE.md, committed), and subdirectory files. Modularize with @imports and .claude/rules/. /memory shows what's loaded.", why: "\"A teammate doesn't get the instruction\" usually means it lives in user scope.", links: [D.memory] },
          { name: "Slash commands & skills", level: "Task 3.2", what: "Project commands in .claude/commands/ (shared), personal in ~/.claude/commands/. Skills in .claude/skills/<name>/SKILL.md with frontmatter: context: fork for isolated runs, allowed-tools, argument-hint.", why: "Skills are on-demand; CLAUDE.md is always loaded.", links: [D.skills] },
          { name: "Path-specific rules", level: "Task 3.3", what: ".claude/rules/*.md with a paths: glob frontmatter load only when matching files are touched — e.g. **/*.test.tsx conventions for tests spread across the repo.", why: "Better than directory CLAUDE.md files for conventions that cut across directories.", links: [D.memory] },
          { name: "Plan mode vs direct execution", level: "Task 3.4", what: "Plan mode for large, ambiguous, multi-file or architectural changes; direct execution for well-scoped fixes. Explore subagents keep verbose discovery out of the main context.", why: "Neither is always right — match it to scope and uncertainty.", links: [D.workflows] },
          { name: "Iterative refinement", level: "Task 3.5", what: "Concrete input/output examples beat prose; test-driven iteration (share failing tests); the interview pattern to surface unstated requirements; batch interacting issues in one message.", why: "Examples resolve inconsistent interpretation faster than more description.", links: [D.workflows] },
          { name: "Claude Code in CI/CD", level: "Task 3.6", what: "Non-interactive -p/--print mode; --output-format json and --json-schema for machine-parsable results; CLAUDE.md supplies project context; use a separate session/instance to review generated code.", why: "The same session that wrote code is a weak reviewer of it.", links: [D.headless] },
        ],
      },
      {
        title: "Domain 4 — Prompt Engineering & Structured Output (20%)",
        items: [
          { name: "Explicit criteria", level: "Task 4.1", what: "Define exactly what to report vs skip (\"flag only when behavior contradicts the comment\") instead of \"be conservative\" or \"only high-confidence findings\".", why: "Vague confidence instructions don't reduce false positives; specific categories do. High false-positive categories erode trust in all findings.", links: [D.clear] },
          { name: "Few-shot prompting", level: "Task 4.2", what: "2–4 targeted examples covering ambiguous cases, with the reasoning for each choice, to fix inconsistent formatting or judgment.", why: "The highest-leverage fix when detailed instructions alone produce inconsistent output.", links: [D.fewshot] },
          { name: "Structured output via tool use", level: "Task 4.3", what: "JSON schemas through tool definitions/structured outputs eliminate syntax errors but not semantic errors. Use nullable fields for info that may be absent, enum + \"other\" with a detail field, and tool_choice to force extraction.", why: "Required fields with no source data pressure the model to fabricate.", links: [D.structured] },
          { name: "Validation & retry loops", level: "Task 4.4", what: "Validate, then retry with the specific error and the original document. Retries fix format/structure errors, not information that is missing from the source. Self-correction checks (stated total vs computed sum).", why: "Know when a retry can't help.", links: [D.structured] },
          { name: "Batch processing", level: "Task 4.5", what: "Message Batches: ~50% cheaper, up to 24h, no latency SLA, custom_id to correlate results, no multi-turn tool loop inside one request. Good for overnight/weekly jobs; wrong for blocking pre-merge checks.", why: "Match the API to the latency requirement.", links: [D.batch] },
          { name: "Multi-instance & multi-pass review", level: "Task 4.6", what: "An independent instance (without the generator's reasoning) reviews more objectively. Split large reviews into per-file local passes plus a cross-file integration pass.", why: "Attention dilutes across many files in one pass.", links: [D.clear] },
        ],
      },
      {
        title: "Domain 5 — Context Management & Reliability (15%)",
        items: [
          { name: "Preserving critical context", level: "Task 5.1", what: "Extract transactional facts (amounts, dates, order IDs) into a persistent case-facts block instead of progressive summarization; trim verbose tool results to relevant fields; put key findings at the start/end (lost-in-the-middle).", why: "Summaries silently drop exact numbers.", links: [D.context, D.longctx] },
          { name: "Escalation & ambiguity", level: "Task 5.2", what: "Escalate on explicit customer request, policy gaps, or inability to progress. Ask for identifiers when multiple matches exist. Sentiment and self-reported confidence are unreliable escalation signals.", why: "Honor an explicit \"I want a human\" immediately.", links: [D.agents] },
          { name: "Error propagation", level: "Task 5.3", what: "Subagents return structured error context (what failed, partial results, alternatives). Don't suppress errors as empty success, and don't abort the whole workflow on one failure.", why: "Lets the coordinator decide recovery and annotate coverage gaps.", links: [D.research] },
          { name: "Large codebase exploration", level: "Task 5.4", what: "Context degrades over long sessions. Use scratchpad files for key findings, subagents for verbose exploration, /compact, and structured state for crash recovery.", why: "Keep the main context lean and high-signal.", links: [D.context] },
          { name: "Human review & confidence calibration", level: "Task 5.5", what: "Aggregate accuracy hides weak segments — measure per document type and field. Field-level confidence calibrated on labeled data; stratified sampling of high-confidence output.", why: "Don't automate a segment you haven't measured.", links: [D.context] },
          { name: "Information provenance", level: "Task 5.6", what: "Keep claim→source mappings (URL, excerpt, date) through synthesis; preserve conflicting values with attribution rather than picking one; distinguish well-established from contested findings.", why: "Synthesis is where attribution gets lost.", links: [D.research] },
        ],
      },
      {
        title: "The six exam scenarios (4 are drawn per sitting)",
        items: [
          { name: "🎧 Customer Support Resolution Agent", level: "Scenario", what: "An Agent SDK agent with MCP tools (get_customer, lookup_order, process_refund, escalate_to_human) targeting high first-contact resolution.", why: "Tests escalation judgment, programmatic enforcement, hooks, and structured tool errors (D1, D2, D5).", links: [D.hooks] },
          { name: "💻 Code Generation with Claude Code", level: "Scenario", what: "A team using Claude Code for features, refactors and bug fixes, with shared CLAUDE.md, commands, and skills.", why: "Tests CLAUDE.md scope, plan mode, rules, and iterative refinement (D3, D5).", links: [D.memory] },
          { name: "🔬 Multi-Agent Research System", level: "Scenario", what: "A coordinator delegating to web-search, document-analysis, synthesis and report subagents, producing cited reports.", why: "Tests decomposition, context passing, error propagation, and provenance (D1, D2, D5).", links: [D.research] },
          { name: "🧰 Developer Productivity with Claude", level: "Scenario", what: "An agent that explores unfamiliar codebases, generates boilerplate, and automates tasks using built-in tools and MCP servers.", why: "Tests built-in tool choice, MCP config, and context management in long explorations (D1, D2, D5).", links: [D.mcp] },
          { name: "⚙️ Claude Code for CI/CD", level: "Scenario", what: "Claude Code in a pipeline doing automated review, test generation, and PR feedback.", why: "Tests -p mode, structured output, false-positive control, and batch vs synchronous (D3, D4).", links: [D.headless] },
          { name: "🧾 Structured Data Extraction", level: "Scenario", what: "Extracting fields from unstructured documents into JSON schemas with validation, edge cases, and downstream integration.", why: "Tests schema design, validation/retry, few-shot, batching, and human review (D4, D5).", links: [D.structured] },
        ],
      },
    ],
  };
})();
