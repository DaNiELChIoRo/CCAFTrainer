/**
 * Quiz bank for the Claude Certified Architect — Foundations (CCA-F) exam.
 * Each question:
 *  { id, topic, scenario?, context?, prompt, options: [{ text, correct }], explanation }
 * `context` is the scenario setup paragraph; `prompt` is the question itself.
 * A question is "multiple-answer" whenever more than one option is correct; the
 * real exam is single-answer (one key, three distractors), so this bank is too.
 *
 * Topics map 1:1 to the five CCA-F content domains; `blurb` notes each domain's
 * weight on the exam. Scenarios mirror the six the exam draws four from.
 * Domains 1–2 live here; Domains 3–5 are appended by questions2.js.
 */
window.QUIZ_TOPICS = {
  agentic:    { name: "Agentic Architecture & Orchestration", icon: "🕸️", blurb: "27% · agentic loops, coordinator/subagents, enforcement, hooks, decomposition, sessions." },
  toolsmcp:   { name: "Tool Design & MCP Integration",        icon: "🛠️", blurb: "18% · tool descriptions, structured errors, tool_choice, MCP config, built-in tools." },
  claudecode: { name: "Claude Code Configuration & Workflows", icon: "💻", blurb: "20% · CLAUDE.md hierarchy, rules, commands & skills, plan mode, CI/CD." },
  prompting:  { name: "Prompt Engineering & Structured Output", icon: "✍️", blurb: "20% · explicit criteria, few-shot, schemas, validation-retry, batches, multi-pass review." },
  context:    { name: "Context Management & Reliability",     icon: "🧭", blurb: "15% · case facts, escalation, error propagation, calibration, provenance." },
};

window.QUIZ_SCENARIOS = {
  support:    { name: "Customer Support Resolution Agent", icon: "🎧" },
  codegen:    { name: "Code Generation with Claude Code",  icon: "💻" },
  research:   { name: "Multi-Agent Research System",       icon: "🔬" },
  devprod:    { name: "Developer Productivity with Claude", icon: "🧰" },
  cicd:       { name: "Claude Code for CI/CD",             icon: "⚙️" },
  extraction: { name: "Structured Data Extraction",        icon: "🧾" },
};

window.QUIZ_DATA = [
  /* ============================== AGENTIC ARCHITECTURE & ORCHESTRATION (27%) */
  {
    id: "agt-1", topic: "agentic", scenario: "support",
    context: "Your support agent's loop decides it is finished by checking whether the assistant's latest text contains phrases like \"your issue is resolved\". In production, some conversations stop before the refund tool is ever called, and others keep looping after the agent has already answered.",
    prompt: "What change makes loop termination reliable?",
    options: [
      { text: "Continue while stop_reason is \"tool_use\" (executing tools and returning tool_result blocks); stop when it is \"end_turn\"", correct: true },
      { text: "Expand the list of completion phrases (\"resolved\", \"all set\", \"anything else?\") and match them case-insensitively against every reply", correct: false },
      { text: "Instruct the model in the system prompt to end its final message with the token DONE, and exit the loop as soon as that token appears", correct: false },
      { text: "Run a fixed five iterations per conversation, since traces show most tickets need about that many tool calls to reach a resolution", correct: false },
    ],
    explanation: "The API tells you whether the model wants a tool (stop_reason \"tool_use\") or has finished its turn (\"end_turn\"). Parsing natural-language text for completion signals and fixed iteration counts are the two classic anti-patterns — both are fragile and terminate at the wrong time.",
  },
  {
    id: "agt-2", topic: "agentic", scenario: "devprod",
    context: "An engineer added a hard cap of 3 iterations to an agent that explores codebases. Complex investigations now end abruptly with half-finished answers, but the engineer worries that removing the cap could let a confused agent loop forever.",
    prompt: "What is the best design?",
    options: [
      { text: "Use stop_reason as the primary termination signal, keep a generous iteration/budget cap only as a safety net, and surface it when the cap is hit", correct: true },
      { text: "Keep the 3-iteration cap but have the model plan its work up front, so every investigation is scoped to finish within three tool calls", correct: false },
      { text: "Remove all limits, because an agent that has not yet returned end_turn is by definition still making progress and should always be allowed to continue", correct: false },
      { text: "Replace the cap with a heuristic that ends the loop once the assistant's text stops mentioning file names, signaling exploration is done", correct: false },
    ],
    explanation: "Bounded loops are good practice, but the bound is a guardrail, not the normal way the loop ends. Normal termination comes from stop_reason; the cap catches runaway behavior and should be reported (not silently returned as a complete answer).",
  },
  {
    id: "agt-3", topic: "agentic", scenario: "research",
    context: "Users asked the research system about \"the impact of AI on creative industries\". Every report covers only visual art and design. The trace shows the coordinator created three subtasks: AI in digital art, AI in graphic design, and AI in photography. Each subagent completed its subtask well.",
    prompt: "What is the most likely root cause of the incomplete coverage?",
    options: [
      { text: "The coordinator decomposed the topic too narrowly, omitting music, writing, film and other creative industries", correct: true },
      { text: "The web-search subagent's queries were too specific, returning mostly visual-art sources, and should be broadened with more general keywords", correct: false },
      { text: "The synthesis subagent dropped findings on other industries because its context window overflowed while merging the three result sets", correct: false },
      { text: "The subagents needed a larger max_tokens value so each could cover additional industries beyond its assigned subtask", correct: false },
    ],
    explanation: "The subagents did exactly what they were asked. Coverage was lost at decomposition — the coordinator's task breakdown determines what gets researched. Read the trace from the top: when every subtask succeeds but the result is incomplete, the plan was incomplete.",
  },
  {
    id: "agt-4", topic: "agentic", scenario: "research",
    context: "The coordinator has gathered findings from three search subagents and now spawns a synthesis subagent with the prompt \"Synthesize the findings so far into a report.\" The synthesis output is generic and mentions none of the gathered sources.",
    prompt: "What is the fix?",
    options: [
      { text: "Include the actual findings (with sources) directly in the synthesis subagent's prompt, since subagents don't inherit the coordinator's conversation", correct: true },
      { text: "Raise the synthesis subagent's temperature so it explores the coordinator's shared history more thoroughly and draws on more of the sources", correct: false },
      { text: "Give the synthesis subagent the same web-search and document tools as the search subagents so it can redo the research and cite sources itself", correct: false },
      { text: "Tell the synthesis subagent to call the coordinator's memory tool to read back the earlier turns in which the search subagents reported their findings", correct: false },
    ],
    explanation: "Subagents start with an isolated context: they see only what you put in their prompt. \"The findings so far\" refers to context the subagent never received. Pass the complete prior results explicitly, ideally in a structured form that keeps content and metadata (URL, date) separate.",
  },
  {
    id: "agt-5", topic: "agentic", scenario: "research",
    context: "You configure a coordinator with the Claude Agent SDK and define four subagents (search, document analysis, synthesis, report). When you run it, the coordinator tries to do all the work itself and never delegates.",
    prompt: "Which configuration problem should you check first?",
    options: [
      { text: "Whether the coordinator's allowedTools includes the Task (Agent) tool used to spawn subagents", correct: true },
      { text: "Whether each subagent definition has been given a full copy of the coordinator's system prompt so it knows its role", correct: false },
      { text: "Whether the subagents are defined in the same source file as the coordinator's code, so they are registered together", correct: false },
      { text: "Whether the coordinator is running on a larger model than the subagents, giving it enough capacity to plan delegation", correct: false },
    ],
    explanation: "Delegation happens through the Task (Agent) tool. If the coordinator isn't allowed to call it, it cannot spawn subagents no matter how they are defined — so it falls back to doing the work itself.",
  },
  {
    id: "agt-6", topic: "agentic", scenario: "research",
    context: "A research job runs four independent web-search subagents. Traces show the coordinator spawns one subagent, waits for its result, then spawns the next, so total latency is the sum of all four.",
    prompt: "How do you reduce latency without changing what gets researched?",
    options: [
      { text: "Have the coordinator emit all four Task calls in a single response so the subagents run in parallel", correct: true },
      { text: "Merge the four subagents into one subagent that runs all four searches sequentially, avoiding per-subagent startup overhead", correct: false },
      { text: "Switch the subagents to the Message Batches API so their four requests are submitted together and processed as one batch", correct: false },
      { text: "Lower max_tokens for each subagent so every search response is shorter and each subagent finishes its turn sooner", correct: false },
    ],
    explanation: "Independent subtasks can fan out in parallel when multiple Task tool calls are issued in the same coordinator turn. Batching is for asynchronous, non-latency-sensitive work (up to 24h), and merging subagents loses the context isolation that made them useful.",
  },
  {
    id: "agt-7", topic: "agentic", scenario: "support",
    context: "Policy requires that a customer's identity is verified with get_customer before any call to process_refund. The system prompt states this in bold capitals. Audits show about 3% of refunds were still processed without a verified customer ID.",
    prompt: "What is the most effective change?",
    options: [
      { text: "Enforce the prerequisite in code: block process_refund unless a verified customer ID from get_customer exists in the session", correct: true },
      { text: "Repeat the verification rule at the end of the system prompt as well as the beginning, so it stays salient late in long conversations", correct: false },
      { text: "Add few-shot examples to the system prompt showing the agent always calling get_customer before it ever calls process_refund", correct: false },
      { text: "Ask the agent to state in each reply whether it verified the customer, and have the QA team review a sample of those replies weekly", correct: false },
    ],
    explanation: "Prompt instructions make compliance likely, not guaranteed. When a rule has financial or compliance consequences, a programmatic gate (prerequisite check or hook) makes it deterministic. Prompt wording, examples and self-reports all leave a non-zero failure rate.",
  },
  {
    id: "agt-8", topic: "agentic", scenario: "support",
    context: "Refunds above $500 must be approved by a human. You want the agent to keep handling smaller refunds autonomously.",
    prompt: "Which implementation best guarantees the rule?",
    options: [
      { text: "A PreToolUse hook that intercepts process_refund calls over $500, blocks them, and routes the case to escalate_to_human", correct: true },
      { text: "A system-prompt instruction, placed near the top, telling the agent never to refund more than $500 without first escalating to a human", correct: false },
      { text: "A PostToolUse hook that checks each refund after it is processed and alerts a supervisor whenever the amount exceeds $500", correct: false },
      { text: "Removing process_refund from the agent entirely and requiring human staff to process every refund, whatever the amount", correct: false },
    ],
    explanation: "A PreToolUse hook runs before the tool executes, so it can deterministically block policy violations and redirect the flow. A PostToolUse check is too late (the money has moved), a prompt rule is probabilistic, and removing the tool throws away the automation for the 'safe' cases.",
  },
  {
    id: "agt-9", topic: "agentic", scenario: "support",
    context: "Your agent calls three backend tools. One returns dates as Unix timestamps, one as ISO 8601 strings, and a legacy one as \"MM/DD/YY\". The agent occasionally miscalculates whether an order is inside the 30-day return window.",
    prompt: "Where is the most reliable place to fix this?",
    options: [
      { text: "A PostToolUse hook that normalizes every tool result to one date format before the model sees it", correct: true },
      { text: "A system-prompt section documenting all three date formats, with worked examples of converting between them", correct: false },
      { text: "Asking the model to restate each date in ISO 8601 before comparing it against the 30-day return window", correct: false },
      { text: "Switching to a larger model, which handles date arithmetic across mixed formats far more reliably", correct: false },
    ],
    explanation: "PostToolUse hooks transform tool results deterministically before they enter context — ideal for normalizing heterogeneous formats (dates, units, status codes). Prompt-based conversion relies on the model getting it right every time.",
  },
  {
    id: "agt-10", topic: "agentic", scenario: "support",
    context: "When the agent escalates, human agents receive a link to the full transcript. They report spending several minutes reading each one to work out what has already been tried.",
    prompt: "What should the escalation step pass to the human?",
    options: [
      { text: "A structured handoff summary: customer ID, issue and root cause, actions already taken, amounts involved, and recommended next step", correct: true },
      { text: "The full transcript plus every raw tool result attached as JSON, so the human has complete fidelity and nothing the agent saw is lost", correct: false },
      { text: "Only the customer's most recent message, since that best reflects their current need and avoids anchoring the human on stale turns", correct: false },
      { text: "A sentiment score and urgency tier computed from the conversation, so the human queue can prioritize the angriest customers first", correct: false },
    ],
    explanation: "Humans receiving a handoff usually lack the agent's context. A concise, structured summary of the case lets them act immediately. Raw transcripts push the reading work onto the human; the last message alone loses essential facts.",
  },
  {
    id: "agt-11", topic: "agentic", scenario: "devprod",
    context: "You ask an agent to \"add comprehensive tests to this legacy service\". You don't yet know which modules exist, how they depend on each other, or which are highest risk.",
    prompt: "Which decomposition approach fits this task?",
    options: [
      { text: "Dynamic decomposition: map the structure and identify high-impact areas first, then build and adapt a prioritized plan as dependencies surface", correct: true },
      { text: "A fixed prompt chain that writes tests for every file in alphabetical order, so coverage is systematic and no module can be skipped", correct: false },
      { text: "A single prompt asking for all of the tests at once, so the model sees the whole task and keeps test style consistent across modules", correct: false },
      { text: "Splitting the codebase into equal-sized chunks by line count and assigning one chunk per subagent so the work is evenly balanced across them", correct: false },
    ],
    explanation: "Fixed prompt chains suit predictable, well-understood work. Open-ended investigation needs adaptive decomposition: explore first, generate subtasks from what you learn, and revise the plan as new dependencies surface.",
  },
  {
    id: "agt-12", topic: "agentic", scenario: "extraction",
    context: "Each invoice goes through the same steps every time: extract fields, validate totals, map vendor to an internal ID, and write to the ERP. A colleague proposes an autonomous agent that decides which step to run next.",
    prompt: "What is the better architecture?",
    options: [
      { text: "A code-defined workflow (prompt chain) with validation between steps, because the path is fixed and known in advance", correct: true },
      { text: "An autonomous agent that chooses each next step, because more autonomy generally improves accuracy on multi-step document tasks", correct: false },
      { text: "A multi-agent system with one specialized subagent per step, coordinated by a planner agent that decides the order at runtime", correct: false },
      { text: "A single prompt that performs all four steps in one call and writes directly to the ERP, minimizing latency and cost", correct: false },
    ],
    explanation: "Use the simplest pattern that works. When the steps are known and always the same, a workflow is more predictable, testable and cheaper than an agent. Reserve agents for problems where the path genuinely can't be specified in advance.",
  },
  {
    id: "agt-13", topic: "agentic", scenario: "devprod",
    context: "Yesterday you ran a long Claude Code session analyzing a service. Overnight, a teammate refactored most of the files you analyzed. You want to continue the investigation today.",
    prompt: "What is the best way to continue?",
    options: [
      { text: "Start a new session seeded with a structured summary of yesterday's conclusions, so the agent re-reads current files instead of stale tool results", correct: true },
      { text: "Resume yesterday's session with --resume and continue the investigation as if nothing changed, since the earlier analysis is already loaded in context", correct: false },
      { text: "Resume yesterday's session and tell the agent to trust its earlier analysis of those files, saving the tokens needed to re-read them", correct: false },
      { text: "Fork yesterday's session so the earlier analysis and the refactored code can be compared side by side in two separate branches", correct: false },
    ],
    explanation: "Resuming is right when prior context is still mostly valid (and you can tell it which specific files changed). When most earlier tool results are stale, a fresh session seeded with a summary avoids reasoning over outdated file contents.",
  },
  {
    id: "agt-14", topic: "agentic", scenario: "codegen",
    context: "After a long analysis session, you want Claude to explore two different refactoring strategies — extracting a service layer vs. introducing an event bus — and compare the results, without either attempt contaminating the other.",
    prompt: "Which session feature fits?",
    options: [
      { text: "fork_session, to create independent branches from the shared analysis baseline", correct: true },
      { text: "--resume twice in a row on the same session ID, trying one strategy in each resumed copy", correct: false },
      { text: "/compact before each attempt so the context is smaller and the earlier attempt gets summarized away", correct: false },
      { text: "Start two blank sessions and re-run the full analysis in each, then try one strategy per session", correct: false },
    ],
    explanation: "Forking creates divergent branches that share everything up to the fork point. Each strategy keeps the analysis but neither sees the other's changes. Re-running the analysis from scratch wastes the work; resuming the same session twice mixes the two attempts.",
  },
  {
    id: "agt-15", topic: "agentic", scenario: "research",
    context: "To cut latency, an engineer proposes letting subagents message each other directly instead of returning results to the coordinator.",
    prompt: "What is the strongest reason to keep routing communication through the coordinator?",
    options: [
      { text: "It gives one place for observability, consistent error handling, and control over what information each agent receives", correct: true },
      { text: "Subagents are technically unable to send messages to one another unless the coordinator explicitly relays them on their behalf", correct: false },
      { text: "Routing every result through the coordinator always reduces total token usage, since subagents never repeat shared context", correct: false },
      { text: "Direct peer-to-peer communication would require every subagent to run on the same model and share a single system prompt", correct: false },
    ],
    explanation: "Hub-and-spoke orchestration centralizes visibility and control: the coordinator sees every result, handles failures consistently, and decides what context each subagent gets. Peer-to-peer messaging makes failures and information flow much harder to trace.",
  },
  {
    id: "agt-16", topic: "agentic", scenario: "research",
    context: "While writing, the synthesis subagent often needs to confirm a simple fact (e.g. a date or a company's headquarters). Each check currently goes back to the coordinator, which spawns a search subagent — adding 2–3 round trips per report.",
    prompt: "What is the most appropriate change?",
    options: [
      { text: "Give the synthesis subagent a narrowly scoped verify_fact tool for simple lookups, while complex research still routes through the coordinator", correct: true },
      { text: "Give the synthesis subagent the full set of web-search and document tools so it can resolve any verification question itself, without round trips", correct: false },
      { text: "Tell the synthesis subagent to skip verification of simple facts and rely on its training data, since dates and headquarters rarely change", correct: false },
      { text: "Have the coordinator pre-verify every fact that might conceivably be needed and pass the full verified list in before synthesis begins", correct: false },
    ],
    explanation: "Least privilege with a pragmatic exception: a single, constrained tool covers the high-frequency simple case. Handing over the full toolset blurs the agent's role and degrades tool selection; skipping verification sacrifices accuracy.",
  },
  {
    id: "agt-17", topic: "agentic", scenario: "research",
    context: "Users report that reports sometimes miss obvious sub-questions. The coordinator currently runs one round of searches, passes everything to synthesis, and returns the result.",
    prompt: "Which change best improves coverage?",
    options: [
      { text: "Have the coordinator evaluate the synthesis against the original question and re-delegate targeted searches for gaps until coverage suffices", correct: true },
      { text: "Double the number of search subagents in the single round so that many more of the question's possible sub-questions get searched in parallel", correct: false },
      { text: "Ask the synthesis subagent to notice any missing sub-questions and fill those gaps from its own knowledge while writing the report", correct: false },
      { text: "Increase the maximum length of the final report so the synthesis subagent has room to address every sub-question it was handed", correct: false },
    ],
    explanation: "An iterative refinement loop — evaluate, find gaps, re-delegate, re-synthesize — lets the coordinator target missing areas. More parallel searches on the same plan just repeats the same blind spots; filling gaps from model memory loses sourcing.",
  },
  {
    id: "agt-18", topic: "agentic", scenario: "support",
    context: "A single customer message asks for (1) a refund on order #1182 that arrived damaged and (2) a shipping-address change on order #1207, which hasn't shipped yet.",
    prompt: "How should the agent handle the message?",
    options: [
      { text: "Treat it as two distinct issues, investigate each (in parallel where possible) with the shared customer context, then send one combined reply", correct: true },
      { text: "Handle only the first request and ask the customer to open a new ticket for the address change, so each case is tracked and audited separately", correct: false },
      { text: "Escalate to a human, since a message mixing a refund and an address change falls outside what a single agent turn should resolve", correct: false },
      { text: "Merge both requests into a single tool call carrying both order numbers, so the backend processes the refund and address change atomically", correct: false },
    ],
    explanation: "Decompose multi-concern requests into separate items, resolve each with the context they share (the verified customer), and synthesize a single response. Forcing a new ticket or escalating hurts first-contact resolution unnecessarily.",
  },

  /* ===================================== TOOL DESIGN & MCP INTEGRATION (18%) */
  {
    id: "tool-1", topic: "toolsmcp", scenario: "support",
    context: "Your agent has get_customer (\"Retrieves customer information\") and lookup_order (\"Retrieves order information\"). Logs show it often calls get_customer when users ask \"where is my order #4471?\", then makes extra calls to recover.",
    prompt: "What is the most effective first step?",
    options: [
      { text: "Expand each tool's description with its purpose, expected inputs (e.g. order number vs email), example queries, and when to use it over the other", correct: true },
      { text: "Add a separate classifier model that reads each user message and decides which tool to call before the agent runs, then passes that choice to the agent", correct: false },
      { text: "Add few-shot examples to the system prompt showing correct tool choices for order-number versus account questions, leaving descriptions as is", correct: false },
      { text: "Merge both into a single get_data tool that returns customer and order information together, so the agent can never pick the wrong one", correct: false },
    ],
    explanation: "Tool descriptions are the main signal the model uses to choose tools. Minimal, overlapping descriptions cause misrouting. Fixing the descriptions is the low-effort, high-leverage first step; routing layers and few-shot add cost and complexity without fixing the root cause.",
  },
  {
    id: "tool-2", topic: "toolsmcp", scenario: "support",
    context: "Tool descriptions were improved, but the agent still calls search_knowledge_base for nearly every message, including order-status questions. The system prompt contains the line \"Always search the knowledge base first for any customer question.\"",
    prompt: "What should you do?",
    options: [
      { text: "Revise the system prompt instruction, which is overriding the tool descriptions, so it applies only to policy and how-to questions", correct: true },
      { text: "Rename search_knowledge_base to something less generic so the model notices it less often and falls back to the more specific tools", correct: false },
      { text: "Remove search_knowledge_base from the agent's toolset entirely, since the order and account tools already cover most customer questions", correct: false },
      { text: "Set tool_choice to force lookup_order on every message, since order-status questions are the most common request the agent receives", correct: false },
    ],
    explanation: "System prompt wording can create unintended tool associations that override good descriptions. Fix the conflicting instruction. Removing the tool or forcing another one breaks legitimate uses.",
  },
  {
    id: "tool-3", topic: "toolsmcp", scenario: "support",
    context: "lookup_order returns {\"error\": \"Operation failed\"} both when the order service times out and when the order number doesn't exist. The agent keeps retrying non-existent order numbers and sometimes tells customers a valid order doesn't exist.",
    prompt: "How should the tool report errors?",
    options: [
      { text: "Return isError with an error category (e.g. transient vs. not-found/validation), an isRetryable flag, and a human-readable description", correct: true },
      { text: "Return an empty result for every error, so the agent never sees a failure and simply tells the customer that no matching order was found", correct: false },
      { text: "Throw an exception that terminates the conversation, so a human can investigate the order service before the agent says anything wrong", correct: false },
      { text: "Retry inside the tool indefinitely with backoff until the order service responds, so the agent only ever receives a definitive answer", correct: false },
    ],
    explanation: "Structured error metadata lets the agent choose the right recovery: retry transient failures, ask the customer to re-check a not-found number, or explain a business-rule rejection. Uniform generic errors make every failure look the same.",
  },
  {
    id: "tool-4", topic: "toolsmcp", scenario: "research",
    context: "A document-analysis subagent's database query timed out. Its tool returned [] (an empty list), and the coordinator's final report stated \"no relevant internal documents exist\".",
    prompt: "What design flaw caused this?",
    options: [
      { text: "The tool doesn't distinguish an access failure from a valid empty result, so a timeout looked like a successful search with no matches", correct: true },
      { text: "The coordinator should never trust empty results from any subagent and should have automatically re-run every search that came back with no matches", correct: false },
      { text: "The subagent should have answered from its training data when the query failed, rather than returning nothing to the coordinator", correct: false },
      { text: "The query timeout was configured too long and should be shortened so the database fails fast and the subagent can retry sooner", correct: false },
    ],
    explanation: "\"We couldn't look\" and \"we looked and found nothing\" are different facts. Suppressing errors as empty success leads to confidently wrong conclusions. Return an error (with retryability) for failures, and a clear empty result only when the query actually succeeded.",
  },
  {
    id: "tool-5", topic: "toolsmcp", scenario: "research",
    context: "Web-search subagents occasionally hit transient rate-limit errors from the search provider. Currently every such error is sent straight back to the coordinator, which re-plans the whole research job.",
    prompt: "Where should transient errors be handled?",
    options: [
      { text: "Locally in the subagent with bounded retry and backoff; only unresolved errors go to the coordinator, with what was attempted and any partial results", correct: true },
      { text: "Only in the coordinator, because subagents must never make decisions about errors and only the coordinator has the full picture of the overall research job", correct: false },
      { text: "Nowhere — transient rate-limit errors clear up on their own, so the subagent should ignore them and report success with whatever it gathered", correct: false },
      { text: "In the final report, by adding a caveat telling users that some searches may have failed and that the results might therefore be incomplete", correct: false },
    ],
    explanation: "Recover close to the failure when you can; escalate with context when you can't. Bouncing every transient error to the coordinator wastes work, and hiding failures as success produces false conclusions.",
  },
  {
    id: "tool-6", topic: "toolsmcp", scenario: "research",
    context: "To keep things simple, every agent in the research system was given all 18 available tools. The synthesis agent now sometimes runs web searches instead of synthesizing, and tool-selection errors have increased across the board.",
    prompt: "What is the best fix?",
    options: [
      { text: "Give each agent only the tools relevant to its role (typically 4–5), e.g. remove web search from the synthesis agent", correct: true },
      { text: "Keep all 18 tools on every agent but add a line to each agent's prompt listing the tools it should ignore for its role", correct: false },
      { text: "Keep all 18 tools but sort them alphabetically and group them by prefix so the model can scan and choose between them faster", correct: false },
      { text: "Combine the 18 tools into three large multipurpose tools with a mode parameter, so each agent has fewer tools to choose from", correct: false },
    ],
    explanation: "Too many tools degrade selection reliability, and out-of-role tools invite agents to drift from their job. Scope each agent's toolset to its responsibility.",
  },
  {
    id: "tool-7", topic: "toolsmcp", scenario: "extraction",
    context: "Your pipeline must always run extract_metadata before any enrichment tools, because enrichment depends on the document type it returns. Sometimes the model calls an enrichment tool first.",
    prompt: "How do you guarantee the order of the first step?",
    options: [
      { text: "On the first request, force the tool with tool_choice {\"type\": \"tool\", \"name\": \"extract_metadata\"}, then run later steps in follow-up turns", correct: true },
      { text: "Set tool_choice to \"auto\" and list extract_metadata first in the tools array, so it is the most prominent option on the first request", correct: false },
      { text: "Set tool_choice to \"any\" on the first request so the model must call some tool before producing any text, then switch back to \"auto\" for later turns", correct: false },
      { text: "Write \"call extract_metadata first\" in capitals in the system prompt and repeat the rule in each enrichment tool's description", correct: false },
    ],
    explanation: "Forcing a specific tool guarantees which tool runs. \"auto\" allows any choice (or plain text); \"any\" guarantees *a* tool call but not *which* one; prompt wording is not a guarantee.",
  },
  {
    id: "tool-8", topic: "toolsmcp", scenario: "extraction",
    context: "You define three extraction tools — one each for invoices, receipts and contracts. The document type is unknown in advance. Sometimes the model replies with conversational text describing the document instead of calling any tool.",
    prompt: "Which tool_choice setting fixes this while still letting the model pick the right schema?",
    options: [
      { text: "\"any\" — the model must call one of the tools, but chooses which", correct: true },
      { text: "\"auto\" — the model decides whether to call a tool, guided by the three schemas", correct: false },
      { text: "Force the invoice tool, since invoices are the most common document type", correct: false },
      { text: "\"none\" — so the model returns the extracted JSON as plain text instead", correct: false },
    ],
    explanation: "\"any\" requires a tool call without dictating which tool, so the model still selects the right schema for the document. \"auto\" permits the text replies you're seeing; forcing one tool picks the wrong schema for the other types.",
  },
  {
    id: "tool-9", topic: "toolsmcp", scenario: "devprod",
    context: "Your team wants every developer's Claude Code to connect to the company's Jira MCP server. Each developer has their own API token.",
    prompt: "How should the server be configured?",
    options: [
      { text: "In a project-scoped .mcp.json committed to the repo, referencing the token via environment variable expansion such as ${JIRA_TOKEN}", correct: true },
      { text: "In each developer's user-scope config, set up manually from a wiki page so that personal tokens never touch the repository at all", correct: false },
      { text: "In a project-scoped .mcp.json committed to the repo, with one shared service token written directly into the file so setup is zero-touch", correct: false },
      { text: "In the project CLAUDE.md, describing the server's URL and auth scheme so Claude can connect to it for every developer on the team", correct: false },
    ],
    explanation: "Project scope (.mcp.json) is version-controlled and shared, so everyone gets the same server definition; ${ENV_VAR} expansion keeps credentials out of the repository. CLAUDE.md is instructions, not server configuration.",
  },
  {
    id: "tool-10", topic: "toolsmcp", scenario: "devprod",
    context: "You want to try an experimental MCP server for your personal notes app while working in the team repository. Teammates should not see or load it.",
    prompt: "Where should you configure it?",
    options: [
      { text: "In user scope (~/.claude.json), which applies to you across projects and isn't shared via the repo", correct: true },
      { text: "In the repo's .mcp.json, with a comment next to the entry asking teammates to ignore or disable the server locally", correct: false },
      { text: "In the project CLAUDE.md, under a \"personal\" heading that describes the server so only your sessions pick it up", correct: false },
      { text: "In .claude/rules/ with a paths: glob that matches only your own files, so the server loads just for your work", correct: false },
    ],
    explanation: "User-scoped MCP servers are personal: available to you, invisible to the team. Project scope (.mcp.json) is for shared, committed configuration.",
  },
  {
    id: "tool-11", topic: "toolsmcp", scenario: "devprod",
    context: "You're helping a developer remove a deprecated function, legacyAuth(). You need to find every file that calls it, across thousands of files.",
    prompt: "Which built-in tool is the right first choice?",
    options: [
      { text: "Grep, which searches file contents for a pattern such as legacyAuth\\(", correct: true },
      { text: "Glob, which matches files by name or path pattern, such as **/*auth*.ts", correct: false },
      { text: "Read on every source file in turn, checking each one for the call", correct: false },
      { text: "Bash with ls -R to list the full directory tree and spot callers", correct: false },
    ],
    explanation: "Grep searches *inside* files (function names, error strings, imports). Glob finds files by *path* (e.g. **/*.test.ts). Reading every file wastes context; a directory listing doesn't reveal callers.",
  },
  {
    id: "tool-12", topic: "toolsmcp", scenario: "codegen",
    context: "Claude tries to use Edit to change a configuration block, but the edit fails because the anchor text it chose appears several times in the file.",
    prompt: "What is the appropriate fallback?",
    options: [
      { text: "Read the full file and write the modified content back (Read + Write), or choose a longer anchor that is unique", correct: true },
      { text: "Retry the same Edit call a few times until it succeeds, since edit failures on large files are often transient", correct: false },
      { text: "Delete the duplicated blocks first so the anchor becomes unique, then apply the original Edit call as planned", correct: false },
      { text: "Ask the user to make the change manually, since the Edit tool cannot operate on files that contain duplicated text", correct: false },
    ],
    explanation: "Edit requires a unique match. When a unique anchor isn't practical, Read + Write is the reliable fallback. Retrying the same call fails the same way; deleting code changes behavior.",
  },
  {
    id: "tool-13", topic: "toolsmcp", scenario: "devprod",
    context: "Your agent spends many turns calling list_projects, list_epics and get_epic just to discover what exists in the issue tracker before it can do any real work.",
    prompt: "Which MCP capability best reduces this exploratory overhead?",
    options: [
      { text: "Expose the catalog (e.g. project and epic summaries) as MCP resources the agent can read as context, without exploratory tool calls", correct: true },
      { text: "Add more granular list_* tools with filter parameters, so each exploratory query returns smaller, faster results and costs fewer tokens", correct: false },
      { text: "Raise the agent's iteration cap so it has more turns available for exploration before it has to start on the real work", correct: false },
      { text: "Describe the entire tracker structure in the system prompt and have someone update that description by hand each week", correct: false },
    ],
    explanation: "MCP resources expose content and catalogs as context, so the agent can see what's available up front. Tools are for actions and queries; using them purely to discover structure wastes turns and tokens.",
  },
];
