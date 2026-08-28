# AI-Harness Agent Rulebook & Guidelines (`AGENTS.md`)

Welcome to the **Sovereign On-Premise Agentic AI Workbench (AI-Harness)** repository. This document is the **authoritative rulebook and operational directive** for all AI coding agents working in this workspace.

---

## 1. Project Mission & Context

You are developing a **100% self-hosted, air-gapped, sandboxed agentic workbench** for confidential industrial and government environments (SIH 2026 · PS 26117 · Target Org: MRPL).

### Core Directives:
1. **Absolute Data Sovereignty:** Zero outbound network traffic. All inference, OCR, RAG, execution, and artifact generation are 100% local.
2. **General-Purpose & Senior-Accessible UX (STRICT):** Never build for technical users or developers. Design for everyday general-purpose users, plant managers, and senior government officials (must be clear, readable, and intuitive even for an 80-year-old). Never use tech fonts (`font-mono`), dense code dumps, or developer jargon in primary interfaces.
3. **Deterministic Orchestration:** Agents operate on a bounded state machine (`INTAKE` → `COMPLETE`) with typed Pydantic contracts and tool allow-lists, never unconstrained looping swarms.
4. **Human-in-the-Loop:** Sensitive decisions and deliverables mandate human sign-off via an explicit `APPROVAL` state.
5. **Real Deliverables:** Generates validated Word notes (`.docx`), step-by-step arithmetic check spreadsheets (`.xlsx`), structured P&ID connectivity graphs (`JSON` + Canvas/SVG overlay), and sandboxed code diffs.

---

## 2. Documentation Hierarchy & Source of Truth

Before planning or modifying code, you **MUST** consult the appropriate documentation files:

```
ai-harness/
├── DOCS/
│   ├── GENERAL_PROJECT_DOC.md        <-- [PRIMARY ARCHITECTURE] System architecture, hardware strategy, API contracts & workflows
│   ├── FRONTEND_DOC.md               <-- [FRONTEND SPEC] Layout, component contracts, SSE protocols, state models & build order
│   ├── SIH_26117_Implementation_PRD_v2.md <-- [PRD & SCOPE] Exact PS traceability matrix, frozen contracts, non-goals
│   ├── SIH26117_Enhanced_Research_Document (1).md <-- [RESEARCH SYNTHESIS] Multi-model consensus & threat model
│   └── SIH_26117_Frontend_Build_Plan.md           <-- [ORIGINAL FRONTEND STRATEGY]
├── frontend/
│   ├── DESIGN.md                     <-- [UI TOKENS & DESIGN SYSTEM] Color tokens, 8px spacing, typography & component rules
│   └── FRONTEND_DOC.md               <-- Local mirror of frontend specification
└── AGENTS.md                         <-- This rulebook
```

### Reading Checklist Before Starting Work:
- **For Architecture & API Contracts:** Read [`DOCS/GENERAL_PROJECT_DOC.md`](file:///home/johan/Hackathons/SIH2026/ai-harness/DOCS/GENERAL_PROJECT_DOC.md).
- **For Frontend UI & Components:** Read [`DOCS/FRONTEND_DOC.md`](file:///home/johan/Hackathons/SIH2026/ai-harness/DOCS/FRONTEND_DOC.md) and [`frontend/DESIGN.md`](file:///home/johan/Hackathons/SIH2026/ai-harness/frontend/DESIGN.md).
- **For Scope Verification & Non-Goals:** Read Section 13 in [`DOCS/SIH_26117_Implementation_PRD_v2.md`](file:///home/johan/Hackathons/SIH2026/ai-harness/DOCS/SIH_26117_Implementation_PRD_v2.md).

---

## 3. Skills Discovery & Usage (`.agents/skills/`)

Always inspect and leverage installed skills in the project before generating or modifying components:

### Available Workspace Skills:
1. **`shadcn`** (`frontend/.agents/skills/shadcn/`):
   - Use when adding, configuring, or composing Shadcn/UI and Base UI component primitives.
   - Adhere to the established Tailwind CSS v4 and Next.js 16 conventions.
2. **`ui-ux-pro-max`** (`frontend/.agents/skills/ui-ux-pro-max/`):
   - Use when designing layouts, refining micro-interactions, structuring dashboards, and tuning visual hierarchies.
3. **Built-in Environment Skills**:
   - `agy-customizations`: Guide for customizations, rules, and hooks.
   - `antigravity-guide`: Guide for Antigravity IDE and tooling.

> **Rule:** If a task relates to adding a UI component or configuring styling, always check if a relevant skill exists in `.agents/skills/` and read its `SKILL.md` before coding.

---

## 4. Frontend & Design System Rules (`frontend/DESIGN.md`)

When writing frontend code (located in `frontend/`):
- **Framework:** Next.js 16 (App Router) + React 19 + TypeScript 5. Read `node_modules/next/dist/docs/` if in doubt about breaking changes.
- **Styling:** Tailwind CSS v4 using semantic CSS variables and OKLCH color spaces. Avoid hardcoded hex colors when semantic classes exist.
- **Visual Aesthetic:** Dark technical "Industrial Workbench" theme.
  - **Spacing:** Strict 8px grid system (`gap-2`, `p-4`, `m-6`, etc.).
  - **Typography:** System-ui / Inter font stack, with monospace used for logs, timelines, P&ID tags, and routing receipts.
  - **Status Conventions:**
    - **Green (`oklch(0.7 0.15 145)` / `#10b981`):** Verified, valid artifacts, air-gapped active, approved.
    - **Amber (`oklch(0.75 0.15 75)` / `#f59e0b`):** In-progress step, model swapping in VRAM, awaiting human approval.
    - **Red (`oklch(0.65 0.2 25)` / `#ef4444`):** Blocked outbound packet, sandbox test failure / repair loop.
    - **Teal / Cyan (`oklch(0.511 0.096 186.391)`):** Routing receipts, brand accents, selected graph nodes.
- **Avoid:** Gradient colors, pulse animation, fancy buzz words. Keep it professional.

### Required Frontend Deliverables & Persuasion Elements:
1. **Sovereignty Monitor Strip:** Must be persistently rendered across all screens (proving zero external calls and active air-gap).
2. **Routing Receipt Badge:** Displayed on every response showing model name, task type, and selection reason.
3. **Execution Timeline:** Real-time checklist tracking audit-log progress steps.
4. **Approval Gate Modal/Bar:** Required for confirming generated notes and recommendations.
5. **Context Panel:** 4 tabs (`Files`, `Sources`, `Artifacts`, `P&ID Graph Viewer`).

---

## 5. Backend & System Engineering Rules

When writing backend code (located in `backend/`):
- **API Framework:** FastAPI with strictly typed Pydantic models for all request/response schemas.
- **Frozen Contract:** All endpoints must adhere to Section 8 of [`DOCS/GENERAL_PROJECT_DOC.md`](file:///home/johan/Hackathons/SIH2026/ai-harness/DOCS/GENERAL_PROJECT_DOC.md).
- **Streaming:** `/api/chat` streams state transitions, tool calls, and text deltas via Server-Sent Events (`text/event-stream`).
- **Data Persistence:**
  - Task State & Audit Logs: SQLite + JSONL append-only log.
  - Vector Store: Qdrant single-container collection (`bge-m3` embeddings).
  - Jailed Storage: All file tools operate strictly within `workspace/{task_id}/`.
- **Sandbox Security:** Docker container executions must strictly specify `--network=none`, `--cap-drop=ALL`, `--security-opt=no-new-privileges`, `--memory=512m`, `--cpus=1`, and read-only mounts.

---

## 6. Scope Boundaries & Explicit Non-Goals

Do **NOT** implement or propose the following items (they are out of scope and risk breaking the demo):
- ❌ Cloud APIs or cloud fallback of any kind.
- ❌ Giant 70B+ / MoE models that fail on laptop hardware (max target is 7B–8B quantized).
- ❌ Unrestricted multi-agent looping swarms (state machine must be bounded with step caps).
- ❌ Custom inference engines or custom vector DB implementations.
- ❌ In-demo fine-tuning.
- ❌ Production multi-node Kubernetes / enterprise SSO / IAM.
- ❌ General arbitrary CAD parsers (P&ID pipeline is tuned for standard ISA-5.1 fixtures).

---

## 7. Execution & Verification Workflow

When executing any task:
1. **Review Requirements:** Check PRD v2 and General Doc for exact specifications.
2. **Check Available Skills:** Look inside `.agents/skills/` for relevant helpers.
3. **Write Clean, Typed Code:** TypeScript strict mode for frontend; Pydantic v2 for backend.
4. **Preserve Integrity:** Never delete existing docstrings, comments, or working configurations without explicit direction.
5. **Verify Locally:** Validate builds (`pnpm typecheck`, `pnpm build`, FastAPI startup) before declaring tasks complete.

## DOs and DON'Ts 
1. Always update/create docs if needed
2. Reload documentation to context when needed
3. Never hardcode texts statically, use json files when needed so that changing one file updates static texts