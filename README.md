# 🏛️ CCA-F Trainer

An **unofficial**, scenario-based practice-quiz web app for the **Claude Certified Architect — Foundations (CCA-F)** certification. Zero-dependency, static HTML/CSS/JS. It uses the same quiz engine as the [CCDV-F Trainer](https://github.com/DaNiELChIoRo/CCDVFTrainer), and its question bank is written against the CCA-F exam blueprint.

> Not affiliated with or endorsed by Anthropic. A study aid, not exam content. Always confirm details against the official Exam Guide in Anthropic Academy.

## The exam, at a glance

| | |
|---|---|
| Exam | Claude Certified Architect — Foundations (CCA-F) |
| Items | 60 scenario-based multiple-choice (one correct answer, three distractors) |
| Time | 120 minutes |
| Passing score | Scaled **720** (100–1,000) |
| Scenarios | 4 drawn at random from a pool of 6 |
| Delivery | Proctored, closed-book, via Anthropic Academy |

## Domains (topics = the 5 blueprint domains)

| Topic | Weight | In bank | Covers |
|-------|------:|------:|--------|
| 🕸️ Agentic Architecture & Orchestration | 27% | 18 | stop_reason loops, coordinator/subagents, context passing, programmatic enforcement, hooks, decomposition, sessions |
| 🛠️ Tool Design & MCP Integration | 18% | 13 | tool descriptions, structured errors, tool_choice, scoped toolsets, `.mcp.json` vs user scope, built-in tools |
| 💻 Claude Code Configuration & Workflows | 20% | 15 | CLAUDE.md hierarchy, `.claude/rules/`, commands & skills, plan mode, iterative refinement, `-p` in CI |
| ✍️ Prompt Engineering & Structured Output | 20% | 14 | explicit criteria, few-shot, schemas & nullable fields, validation-retry, Message Batches, multi-pass review |
| 🧭 Context Management & Reliability | 15% | 14 | case-facts blocks, escalation triggers, error propagation, calibration, provenance, caching, backoff |

74 questions in total. Every item is tagged with one of the six exam scenarios (🎧 Customer Support, 💻 Code Generation, 🔬 Multi-Agent Research, 🧰 Developer Productivity, ⚙️ CI/CD, 🧾 Structured Data Extraction), and that scenario is shown on the question card above a short setup paragraph. Context Management is slightly over-represented compared with its 15% exam weight.

## Features

- **Quiz mode vs. Review mode.** Quiz mode tests you and shows review links at the end for your weak domains. Review mode also adds doc links after each answer, ranked by how relevant they are to that question.
- **Scenario framing.** Questions follow the exam's style: a setup paragraph, then a question about the best architectural choice.
- **Instant explanations** that say why the key is right and why the tempting distractors are wrong.
- **Per-domain breakdown.** Any domain under 70% gets curated links to official docs.
- **📋 Exam Blueprint & Reference.** A reference view (not a quiz) listing every domain's task statements and the six scenarios.
- **Best-score tracking**, **light/dark theme**, **installable PWA** with offline support.
- **No build step, no dependencies.**

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Push this folder to a GitHub repo.
2. **Settings → Pages → Source: _Deploy from a branch_ → `main` / `(root)`**, Save.
3. It goes live at `https://<user>.github.io/<repo>/`. The `.nojekyll` file makes Pages serve files as-is.

## Add or edit questions

- **`assets/js/questions.js`**: domains, scenarios, and Domains 1–2. **`assets/js/questions2.js`**: Domains 3–5. Each entry:
  ```js
  {
    id: "agt-19",
    topic: "agentic",              // key from QUIZ_TOPICS
    scenario: "research",          // optional, key from QUIZ_SCENARIOS
    context: "Setup paragraph…",   // optional
    prompt: "What should you do?",
    options: [
      { text: "The key", correct: true },
      { text: "A plausible distractor", correct: false },
    ],
    explanation: "Why the key is right and the distractors aren't.",
  }
  ```
  Keep distractors about as long and specific as the key, so the answer can't be guessed from length.
- **`assets/js/bibliography.js`**: per-domain review links.
- **`assets/js/techniques.js`**: the Exam Blueprint & Reference view.
- **`assets/js/questions.auto.js`**: an optional quarantined review queue. It's empty by default, and only entries a human has set to `reviewed: true` are served.

After adding a JS file, also list it in `sw.js`'s `SHELL` and bump `CACHE`.
