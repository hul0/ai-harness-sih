# Sovereign On-Premise Agentic AI Workbench (AI-Harness)
## Master Project Specification & Architecture Overview

**Problem Statement ID:** SIH 2026 · PS 26117  
**Target Organization:** MRPL (Mangalore Refinery and Petrochemicals Limited)  
**Theme:** Smart Automation / Data Sovereignty & Confidential Computing  
**Document Version:** 2.0 (Master General Doc)  
**Target Environment:** Air-Gapped Industrial / PSU / Defence / Government Workstation  

---

## 1. Executive Summary & Mission

The **Sovereign On-Premise Agentic AI Workbench (AI-Harness)** is a local, sandboxed, air-gapped agentic runtime engineered specifically for strictly confidential, high-security industrial and governmental environments (e.g., oil refineries, public sector undertakings, defence organizations, and administrative bodies).

### Core Value Proposition
Conventional cloud AI assistants introduce severe data exfiltration risks and cannot operate within isolated industrial control systems (ICS) or air-gapped enclaves. AI-Harness replaces the cloud reliance with a **100% self-hosted, multi-model, bounded agentic runtime** that:
1. **Enforces Absolute Data Sovereignty:** Provably guarantees zero outbound network traffic through container and host-level egress blocking, with live cryptographic and socket telemetry.
2. **Dynamically Routes Models:** Houses a model-agnostic registry that swaps open-weight LLMs/VLMs on a single laptop-tier or server GPU according to task modality (Reasoning, Coding, Vision, Embeddings).
3. **Executes Multi-Step Workflows Deterministically:** Uses a state machine (`INTAKE` → `COMPLETE`) with bounded repair loops, typed Pydantic contracts, and tool allow-listing.
4. **Integrates Multimodal Local Ingestion & Classical CV:** Reads scanned, degraded, and handwritten inspection reports via local OCR/VLM and constructs machine-readable connectivity graphs from Piping & Instrumentation Diagrams (P&IDs).
5. **Grounds Responses in Local Knowledge (RAG):** Cites specific SOP numbers, sections, and page numbers from internal manuals stored in a local Qdrant vector database.
6. **Produces Verified, Deterministic Deliverables:** Emits validated Word notes (`.docx`), step-by-step calculation sheets (`.xlsx`), presentations (`.pptx`), and code diffs.
7. **Empowers Humans via Approval Gates:** Mandates human sign-off on sensitive decisions, adhering to industrial safety standards.

---

## 2. PS Requirement Traceability Matrix

| SIH Problem Statement Requirement | Implementation in AI-Harness | Spec / Functional Module |
| :--- | :--- | :--- |
| **Self-hosted, air-gapped, zero data leakage** | Hardened container isolation, host egress denial, live packet counters | FR-8 (Sovereignty Proof Plane), Workflow 3 |
| **Multi-model selection & dynamic routing** | Central Model Registry & Hybrid Router with visible "Routing Receipts" | FR-1 (Model Registry & Router) |
| **Pluggable model backends** | Thin provider/adapter layer (`models/adapters/`) over Ollama/vLLM/llama.cpp | Section 4, FR-1 |
| **Agentic planning & iterative self-repair** | Bounded deterministic state machine with max-step limits & REPAIR state | FR-2 (Agent Orchestrator) |
| **Controlled local tools** | Jailed workspace tools: filesystem, doc extraction, RAG, sandboxed execution | FR-3 (Typed Tool Registry) |
| **Multimodal document understanding** | Local OCR (Tesseract), Vision LLM fallback (Qwen2.5-VL), PDF text layers | FR-4 (Multimodal Ingestion) |
| **Engineering drawing / P&ID parsing** | Structured ISA-5.1 symbol detection, line skeletonization, graph assembly | FR-4B, Workflow 4 (P&ID Pipeline) |
| **Grounding in internal manuals/SOPs** | Local dense vector search (bge-m3 + Qdrant) with mandatory section citations | FR-5 (Local RAG Pipeline) |
| **Real deliverables (DOCX, XLSX, Code)** | `python-docx`, `openpyxl` step-by-step calculations, structural validators | FR-7 (Artifact Generation) |
| **Sandboxed code execution** | Ephemeral, rootless-equivalent Docker container (`--network=none`, RAM/CPU limits) | FR-6 (Sandbox Execution), Workflow 2 |
| **Auditability & Traceability** | Append-only JSONL audit log rendered live as an Execution Timeline | FR-9 (Security & Auditability) |
| **Single workstation / laptop deployable** | Single-resident LLM memory strategy, VRAM swapping, CPU hard fallback | Section 4 (Hardware Strategy) |

---

## 3. High-Level System Architecture

```
                                  ┌─────────────────────────────────────────┐
                                  │           User / Engineer               │
                                  └────────────────────┬────────────────────┘
                                                       │ Browser (Localhost)
                                                       ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 WORKBENCH FRONTEND (React + Tailwind)                            │
│  ┌──────────────────────────┬──────────────────────────────────────┬───────────────────────────┐  │
│  │       Sidebar Nav        │      Conversation & Step Stream      │       Context Panel       │  │
│  │ • New Task               │ • Live Agent State Progression       │ • Attached Files          │  │
│  │ • Document Library       │ • Model Routing Receipt Badge        │ • SOP Citations           │  │
│  │ • Knowledge Base         │ • Human Approval Gate (Sign-off)     │ • Generated Artifacts     │  │
│  │ • Model Registry Status  │                                      │ • Interactive P&ID Viewer │  │
│  └──────────────────────────┴──────────────────────────────────────┴───────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Agent Execution Timeline: [Step 1: OCR] → [Step 2: RAG] → [Step 3: Calc] → [Step 4: DOCX]    │  │
│  ├─────────────────────────────────────────────────────────────────────────────────────────────┤  │
│  │ Sovereignty Monitor Strip: [Air-Gapped: ACTIVE] [External Calls: 0] [Dropped Packets: 0]    │  │
│  └─────────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┬────────────────────────────────────────────┘
                                                       │ REST + SSE (EventSource)
                                                       ▼
┌───────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                 FASTAPI API GATEWAY & AGENT ENGINE                                │
│                                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ Bounded State Machine: INTAKE → CLASSIFY → PLAN → RETRIEVE → TOOL → VERIFY → ARTIFACT ...   │  │
│  └──────┬──────────────────────┬───────────────────────┬───────────────────────┬───────────────┘  │
│         │                      │                       │                       │                  │
│         ▼                      ▼                       ▼                       ▼                  │
│  ┌──────────────┐      ┌──────────────┐        ┌──────────────┐        ┌──────────────┐           │
│  │ Model Router │      │ Tool Registry│        │ Local RAG    │        │ P&ID CV Line │           │
│  │ & Registry   │      │ (Allowlists) │        │ (bge-m3 +    │        │ (Detector +  │           │
│  │ (Ollama Swaps│      │ (Jailed FS)  │        │  Qdrant)     │        │  Tracer)     │           │
│  └──────┬───────┘      └──────┬───────┘        └──────┬───────┘        └──────┬───────┘           │
└─────────┼─────────────────────┼───────────────────────┼───────────────────────┼───────────────────┘
          │                     │                       │                       │
          ▼                     ▼                       ▼                       ▼
┌──────────────────┐  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   Ollama Engine  │  │ Hardened Sandbox │    │  Qdrant Vector   │    │ OpenCV / Tesseract│
│ (Single Active   │  │ (--network=none  │    │  Database        │    │ ISA-5.1 Template │
│  LLM in VRAM)    │  │  ephemeral)      │    │  (Docker Engine) │    │ Graph Extraction │
└──────────────────┘  └──────────────────┘    └──────────────────┘    └──────────────────┘
```

---

## 4. Hardware & Single-Resident Model Strategy

Designed for **laptop-tier to workstation-tier hardware (4GB – 16GB VRAM)**.

### 4.1 Single LLM Resident at a Time
To ensure compatibility with mobile GPUs (e.g. RTX 4050/4060/4070 Laptop with 6–8 GB VRAM), the system enforces a **single-resident generative model policy**:
- Small embedding models (`bge-m3`) remain resident on CPU/GPU (~1.2 GB).
- Generative models are swapped dynamically via Ollama's `keep_alive` parameter.
- The UI exposes a smooth `"Loading Model..."` badge during swaps.

### 4.2 Standard Model Roster

| Role | Primary Model (Q4_K_M) | Size (VRAM) | Fallback Model (Tight VRAM / CPU) |
| :--- | :--- | :--- | :--- |
| **General Reasoning / Planning** | `qwen3:8b-instruct` | ~5.0 GB | `qwen3:4b-instruct` (~2.5 GB) |
| **Coding & Test Synthesis** | `qwen2.5-coder:7b-instruct` | ~4.5 GB | `qwen2.5-coder:3b-instruct` (~2.0 GB) |
| **Vision / Scans / P&ID Check**| `qwen2.5-vl:7b-instruct` | ~5.0 GB | `qwen2.5-vl:3b-instruct` (~2.5 GB) |
| **Local Text Embeddings** | `bge-m3` | ~1.2 GB | `nomic-embed-text` (~0.6 GB) |

---

## 5. Subsystem Deep-Dive

### 5.1 Agent Orchestrator (Deterministic State Machine)
Instead of an unpredictable, looping ReAct agent, AI-Harness uses an explicit, bounded state machine:
```
[INTAKE] ──► [CLASSIFY] ──► [PLAN] ──► [RETRIEVE] ──► [TOOL] ──► [VERIFY]
                                                        ▲           │
                                                        │ (Fail)    ▼ (Pass)
                                                     [REPAIR]   [ARTIFACT]
                                                                    │
                                                                    ▼
                                                                [APPROVAL] ──► [COMPLETE]
```
- **Strict Invariants:**
  1. Typed Pydantic I/O models for every state transition.
  2. Per-state execution timeout and global max-step limit (prevents infinite loops).
  3. Tool allow-lists filtered strictly by classified task type.
  4. Retrieved RAG context is fed as raw data, never executable instructions.
  5. Mandatory `APPROVAL` state for any consequential document or recommendation.

### 5.2 Model Registry & Hybrid Router (FR-1)
- **Fast Path:** Rule-based heuristics inspect file MIME types and request keywords (e.g., P&ID image → Vision + P&ID Pipeline; `.py` script → Coding LLM; scanned PDF → Vision / OCR).
- **Fallback Classifier:** Lightweight classification prompt if heuristics are ambiguous.
- **Routing Receipt:** Every response generates a metadata token visible on screen:
  `Handled by: Coding Model (qwen2.5-coder:7b-instruct) | Reason: Rule [Python Script Attached]`

### 5.3 Multimodal Ingestion & Structured P&ID Pipeline (FR-4 & FR-4B)
- **Document OCR:** PyMuPDF extracts digital text layers; raster/scanned pages pass to Tesseract; degraded/handwritten sections fall back to Qwen2.5-VL.
- **P&ID Connectivity Graph Extraction:**
  1. *Preprocessing:* Deskewing, morphological cleaning, line enhancement.
  2. *Symbol Detection:* Template/contour matching against ISA-5.1 standard symbols (valves, pumps, tanks, transmitters).
  3. *Line Tracing:* Skeletonization + Connected Component Analysis to trace process pipelines between symbols.
  4. *OCR Binding:* Tesseract reads nearby alphanumeric equipment tags (e.g., `FCV-101`, `P-201A`).
  5. *Graph Assembly:* Generates machine-readable `{ nodes: [...], edges: [...] }` JSON.
  6. *VLM Grounded Narrative:* Qwen2.5-VL interprets the flow path grounded *strictly* on the extracted graph nodes/edges.
  7. *UI Overlay:* Canvas/SVG overlay mapping bounding boxes and connected lines directly over the original drawing.

### 5.4 Local Grounded RAG (FR-5)
- Chunking is section-aware (preserves SOP headers and tables).
- Embedding via `bge-m3`, indexed inside Qdrant.
- Retrieval returns chunk text bundled with strict metadata: `Source: SOP-ENG-042, Section 4.2, Page 17`.
- LLM prompt enforces zero tolerance for uncited claims.

### 5.5 Sandboxed Code Execution (FR-6)
- Generated code executes in an ephemeral, hardened Docker container.
- Hard constraints: `--network=none`, `--cap-drop=ALL`, `--security-opt=no-new-privileges`, `--memory=512m`, `--cpus=1`, `--pids-limit=64`, `--read-only` root with `/workspace` tmpfs mount.
- State machine conducts automated unit testing and self-repairs failed code inside the sandbox.

### 5.6 Artifact Generation & Calculations (FR-7)
- Emits real, production-ready deliverables:
  - `approval_note.docx`: Professional layout with executive summary, SOP citations, risk evaluation, and reviewer signature block.
  - `calculation_sheet.xlsx`: Real spreadsheet containing deterministic formulas (e.g., tolerance calculations against measured values, step-by-step arithmetic verification).
- Automated file validation runs prior to presenting artifacts to the user.

### 5.7 Sovereignty Proof Plane (FR-8)
- Real egress denial at container level (`--network=none`) and host/bridge level (`iptables` / `nftables`).
- Live telemetry monitoring socket activity and external DNS/HTTP requests.
- Front-end Sovereignty Monitor permanently shows:
  `Internet Access: BLOCKED | External Calls: 0 | DNS Queries: 0 | Status: AIR-GAPPED`

---

## 6. Flagship Demonstration Workflows

### Workflow 1: Scanned Inspection Report to Approval Note & Calculation Sheet
1. **Upload:** User uploads a scanned, slightly degraded refinery thickness inspection report.
2. **Ingestion:** Local OCR extracts measured pipe wall thickness (e.g. `3.8 mm`).
3. **Classification & Routing:** Router selects `general-reasoning` LLM.
4. **Local RAG Retrieval:** Queries Qdrant for minimum allowable wall thickness in `SOP-ENG-042 §4.2`.
5. **Deterministic Calculation:** System executes arithmetic verification (`Measured 3.8mm < Min Tolerance 4.5mm → REJECT`).
6. **Artifact Creation:** Generates `approval_note.docx` (with citations) and `calculation_sheet.xlsx` (with calculation steps).
7. **Human Approval Gate:** UI pauses in `APPROVAL` state. Human clicks **Approve**.

### Workflow 2: Sandboxed Coding with Automated Self-Repair
1. **Request:** User requests: *"Write a Python script to compute pressure drop across pipe orifice with unit tests."*
2. **Routing:** Router selects `coding` LLM (`qwen2.5-coder:7b`).
3. **Execution:** Code & tests written to sandbox. Tests are executed inside `--network=none` container.
4. **Seeded Test Failure & Self-Repair:** First test run fails on edge case → agent enters `REPAIR` state → fixes code → re-runs tests → tests pass.
5. **Output:** Verified clean code, diff, and execution log returned to user.

### Workflow 3: Live Sovereignty & Air-Gap Proof
1. **Outbound Attempt:** Agent or user triggers a simulated outbound request (`curl https://api.openai.com` or `curl 8.8.8.8`) inside the sandbox.
2. **Egress Block:** Network layer immediately blocks and drops the packet.
3. **Live Telemetry:** Sovereignty Monitor logs the blocked attempt in real time, increments blocked packet counter, and proves zero external egress.

### Workflow 4: Structured P&ID Understanding & Connectivity Graph
1. **Upload:** User attaches a P&ID diagram.
2. **CV Extraction:** OpenCV pipeline detects pumps, valves, and instruments; traces piping connections; reads tag labels.
3. **VLM Validation:** `qwen2.5-vl` validates graph integrity and drafts a step-by-step flow explanation.
4. **Interactive UI:** Context panel displays the P&ID with an interactive SVG/canvas overlay (clickable nodes and edges) alongside the structured JSON graph.

---

## 7. Project Directory Structure

```
ai-harness/
├── DOCS/                              # Project specifications, PRDs, and manuals
│   ├── GENERAL_PROJECT_DOC.md         # Master General Documentation (This file)
│   ├── SIH_26117_Implementation_PRD_v2.md
│   ├── SIH26117_Enhanced_Research_Document.md
│   └── SIH_26117_Frontend_Build_Plan.md
├── frontend/                          # React + Vite + Tailwind Workbench UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── conversation/          # Message stream & step progression
│   │   │   ├── timeline/              # Live execution timeline checklist
│   │   │   ├── sovereignty/           # Real-time air-gap telemetry monitor
│   │   │   ├── context/               # Files, SOP sources, and artifacts tabs
│   │   │   ├── pid/                   # Interactive P&ID graph & overlay viewer
│   │   │   └── approval/              # Human-in-the-loop review modal/bar
│   │   ├── hooks/                     # useSSE, useTaskState, useSovereignty
│   │   └── App.tsx                    # Workbench shell layout
│   ├── package.json
│   └── tailwind.config.js
├── backend/                           # FastAPI Gateway & Core Engine
│   ├── api/                           # REST routers (chat, tasks, files, artifacts, pid, monitoring)
│   ├── agent/                         # State machine orchestrator, planner, memory, verifier
│   ├── models/                        # Model registry, router, and Ollama provider adapters
│   ├── tools/                         # Typed tool registry (filesystem, documents, code, RAG)
│   ├── pid/                           # P&ID detector, line tracer, graph builder, overlay generator
│   ├── rag/                           # Document ingestion, bge-m3 embeddings, Qdrant search, citations
│   ├── sandbox/                       # Hardened Docker container executor & limits manager
│   ├── artifacts/                     # python-docx, openpyxl, python-pptx builders & validators
│   └── security/                      # Local auth, JSONL audit logger, network packet monitor
├── fixtures/                          # Synthetic test documents for hackathon rehearsal
│   ├── sops/                          # Synthetic MRPL SOP manuals (PDFs)
│   ├── inspection_reports/            # Synthetic degraded/scanned inspection reports
│   └── pids/                          # Public standard ISA-5.1 P&ID sample fixtures
├── docker-compose.yml                 # Orchestration for FastAPI, Qdrant, Ollama, Frontend
└── README.md
```

---

## 8. API Specification Contract

| Endpoint | Method | Payload / Params | Response | Description |
| :--- | :--- | :--- | :--- | :--- |
| `/api/chat` | `POST` | `{ "prompt": str, "file_id": Optional[str] }` | `SSE Stream` | Dispatches task, streams agent state transitions, tool calls, and final tokens |
| `/api/files/upload` | `POST` | `multipart/form-data` | `{ "file_id": "uuid", "filename": str }` | Uploads document/image to per-task workspace |
| `/api/tasks/{id}` | `GET` | `task_id` | `TaskState JSON` | Retrieves complete snapshot of task state machine |
| `/api/tasks/{id}/timeline` | `GET` | `task_id` | `List[AuditEntry]` | Returns audit log entries for task execution checklist |
| `/api/tasks/{id}/approve` | `POST` | `{ "action": "approve" \| "modify" \| "reject" }` | `{ "status": "completed" }` | Resumes agent from `APPROVAL` state |
| `/api/artifacts/{id}` | `GET` | `artifact_id` | Binary File Stream | Downloads generated `.docx`, `.xlsx`, `.pptx`, or `.py` file |
| `/api/knowledge/upload`| `POST` | `multipart/form-data` | `{ "chunks_indexed": int }` | Ingests and embeds SOPs/manuals into Qdrant |
| `/api/models` | `GET` | None | `{ "models": [...], "active_model": str }` | Returns model registry status & active resident LLM |
| `/api/monitoring/sovereignty` | `GET` | None | `{ "status": "AIR-GAPPED", "external_calls": 0, "local_requests": int }` | Real-time sovereignty & egress telemetry |
| `/api/pid/analyze` | `POST` | `{ "file_id": "uuid" }` | `{ "graph": {...}, "overlay_url": str, "narrative": str }` | Runs structured P&ID connectivity pipeline |

---

## 9. Explicit Non-Goals & Scope Boundaries

To guarantee flawless delivery on a single laptop/workstation during the hackathon, the following items are deliberately kept **out of scope**:
1. **Cloud Fallbacks:** No hybrid or cloud failover (violates core problem statement air-gap requirement).
2. **Giant / Frontier Models:** No 70B+ or MoE models that would trigger CPU offloading and freeze live demos.
3. **Unrestricted Multi-Agent Swarms:** No non-deterministic looping agents; state machine is strictly bounded.
4. **Custom Inference Engines / Custom Vector DBs:** Ollama and Qdrant provide battle-tested, standard stability.
5. **Fine-Tuning on Stage:** In-context learning and RAG provide prompt grounding without training instability.
6. **Enterprise SSO / Multi-Tenant RBAC:** Single-tenant local architecture is standard for air-gapped demo.
7. **Arbitrary Hand-Drawn CAD Parsers:** The P&ID parser is tuned against standard ISA-5.1 public fixtures.

---

## 10. Verification & Rehearsal Checklist

- [ ] **Hardware Sanity:** Check VRAM with `nvidia-smi` and confirm Ollama model swap latency (< 5 seconds).
- [ ] **Model Staging:** Pre-pull `qwen3:8b-instruct`, `qwen2.5-coder:7b-instruct`, `qwen2.5-vl:7b-instruct`, and `bge-m3`.
- [ ] **Egress Verification:** Run `docker run --network=none alpine curl 8.8.8.8` and verify instant timeout/drop.
- [ ] **RAG Grounding:** Verify that query responses contain explicit `[Source: SOP-ENG-042, Page X]` citations.
- [ ] **Artifact Verification:** Ensure `.docx` and `.xlsx` open without schema corruption and contain calculated step tables.
- [ ] **End-to-End Rehearsal:** Run all 4 flagship demo workflows sequentially without server restart.
