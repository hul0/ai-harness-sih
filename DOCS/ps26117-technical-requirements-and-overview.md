# ps26117-technical-requirements-and-overview

## Page 1

We are building a  for confidential industrial environments such as
refineries, PSUs, defence-linked organizations, and government offices.
The system must provide capabilities similar to modern AI assistants while ensuring:
• 
• Multiple  can run locally
• The correct model is selected automatically for each task
• AI can perform 
• AI can use controlled local tools
• Documents, scans, images, P&IDs and other multimodal inputs are supported
• Internal SOPs, manuals and documents can be searched through local RAG
• AI can create real deliverables such as DOCX, PPTX, XLSX and code
• Generated code can be executed inside a secure sandbox
• All important actions are auditable
• Network isolation can be visibly demonstrated
The prototype should work on a , even when the internet is unavailable.
User
AI Workbench
Backend
Agent Orchestrator
Model Router Tools Local RAG Sandbox Artifacts
Local Models Files / OCR / Vision Vector DB Isolated Container


---

## Page 2

The system is essentially:
→ → → →
Do not build the application around one specific model.
Use a  so models can be added or replaced without changing the rest of the application.
Possible runtimes:
• Ollama
• llama.cpp
• vLLM
• Hugging Face Transformers
• TensorRT�LLM
Possible model roles:
General/Reasoning LLM Analysis, planning, document reasoning
Coding LLM Code generation and debugging
Vision/Multimodal LLM Images, scans, P&IDs
The application communicates with the , not directly with individual models.
Maintain a registry containing:
Example:
Model ID
Model name
Model type
Context length
Quantization
VRAM requirement
Supported modalities
Supported tasks
Availability
Priority
Endpoint


---

## Page 3

This makes the system .
The router determines which model should handle a request.
Start with a simple hybrid router:
���Detect task type
���Check model capabilities
���Check model availability
���Select the best available model
Do not over-engineer model routing for the prototype.
The central component is the .
It should operate as:
{
  "id": "coding-llm",
  "type": "coding",
  "capabilities": ["python", "debugging", "testing"],
  "endpoint": "local://coding-model"
}
Task Classifier
Document Reasoning LLM
Coding Coding LLM
Vision Vision LLM


---

## Page 4

The agent should maintain a task state containing:
Tools must have controlled interfaces and permissions.
User Request
    ↓
Understand
    ↓
Plan
    ↓
Select Model / Tools
    ↓
Execute
    ↓
Observe Result
    ↓
Verify
    ↓
Retry if necessary
    ↓
Final Answer / Artifact
task_id
user_request
plan
current_step
tool_calls
observations
artifacts
errors
verification_status
final_result
read_file
write_file
list_files
search_files


---

## Page 5

Supported inputs:
• PDF
• Scanned PDF
• Image
• Photograph
• Engineering drawing
• P&ID
• Handwritten document
Processing should roughly follow:
extract_pdf_text
ocr_document
create_docx
create_pptx
create_xlsx
search_knowledge_base
retrieve_document
retrieve_section
create_code
execute_code
run_tests
analyze_image
analyze_pdf_page


---

## Page 6

For scanned PDFs:
All OCR and vision processing must remain local.
Possible OCR technologies:
• Tesseract
• PaddleOCR
• EasyOCR
• Local VLM
The organization should be able to load:
Ingestion:
Input Text / Image OCR / Vision Normalized Data Agent
PDF
 ↓
Detect text layer
 ↓
If scanned → Render pages
 ↓
OCR / Vision
 ↓
Normalize extracted content
 ↓
Agent
SOPs
Engineering manuals
Safety procedures
Past reports
Internal policies
Technical documentation
Past correspondence


---

## Page 7

Retrieval:
The RAG system should return .
Example:
This provides traceability and reduces unsupported AI claims.
Generated code must never execute directly on the host.
Documents
 ↓
Parser
 ↓
Chunking
 ↓
Local Embeddings
 ↓
Vector Database
User Request
 ↓
Agent
 ↓
Knowledge Search
 ↓
Relevant Chunks
 ↓
Reasoning Model
Recommendation:
Inspection should be rejected because the observed
condition violates the specified tolerance.
Source:
SOP-ENG-042
Section 4.2
Page 17


---

## Page 8

Sandbox requirements:
• No network
• CPU limit
• RAM limit
• Execution timeout
• Restricted filesystem
• Temporary workspace
• Process isolation
Example workflow:
The system must produce actual deliverables, not only chat responses.
Initial targets:
Generate Code
Sandbox Manager
Isolated Container
Run / Test
Generate code
 ↓
Execute
 ↓
Tests fail?
 ├─ Yes → Fix → Execute again
 └─ No  → Return verified result


---

## Page 9

Example:
The frontend should expose generated artifacts separately from the conversation.
Every important output should be validated where possible.
.docx
.pptx
.xlsx
.pdf
.py
.csv
.txt
Inspection Report
       ↓
Agent Analysis
       ↓
SOP Retrieval
       ↓
Recommendation
       ↓
DOCX Generator
       ↓
approval_note.docx
       ↓
Validation
Generate
 ↓
Check file validity
 ↓
Check required sections
 ↓
Return


---

## Page 10

The agent should be able to iterate when verification fails.
The AI should , not silently make sensitive organizational decisions.
For example:
Generate
 ↓
Validate workbook
 ↓
Check formulas
 ↓
Check required fields
Generate
 ↓
Execute
 ↓
Test
 ↓
Fix if required
 ↓
Verified result
Analyze Recommend Generate Artifact Human Review Approve / Modify / Reject
Inspection Report
       ↓
AI Analysis
       ↓
Approval Recommendation
       ↓
Approval Note
       ↓
Human Review


---

## Page 11

This is a core requirement, not an optional security feature.
The system should continue working when:
Architecture:
There must be 
.
Do not merely display:
"100% Local"
The infrastructure must enforce and demonstrate it.
Use:
The UI can additionally show:
Internet = DISABLED
BLOCKED BLOCKEDInternet Firewall Local Server
App
Models
Database / RAG
Tools / Sandbox
tcpdump
Wireshark
iptables / nftables
ss


---

## Page 12

The network layer should actually prevent external communication.
Required controls:
• Local authentication
• Role-based authorization
• File permissions
• Tool permissions
• Sandbox isolation
• Network isolation
• Audit logging
• No external telemetry
• Local-only inference
Basic security flow:
Log important agent operations:
SOVEREIGNTY MONITOR
Internet Access       BLOCKED
External API Calls    0
External DNS Queries  0
External Connections  0
Local Requests        184
Status: AIR-GAPPED
User
 ↓
Authentication
 ↓
Authorization
 ↓
Agent
 ↓
Controlled Tools / Models
 ↓
Audit Log


---

## Page 13

The UI should expose an execution timeline:
This is useful for:
• Debugging
• Transparency
• Security auditing
• Demonstrating agentic behavior to judges
A practical structure:
{
  "timestamp": "...",
  "task_id": "...",
  "agent_action": "search_knowledge_base",
  "tool": "kb_search",
  "input": "...",
  "result": "...",
  "model": "local-reasoning-model"
}
✓ Read inspection_report.pdf
✓ OCR completed
✓ Retrieved SOP-042
✓ Analyzed findings
✓ Generated approval note
✓ Validated DOCX


---

## Page 14

backend/
├── api/
│   ├── chat
│   ├── files
│   ├── tasks
│   ├── artifacts
│   └── monitoring
│
├── agent/
│   ├── planner
│   ├── executor
│   ├── memory
│   └── verifier
│
├── models/
│   ├── registry
│   ├── router
│   └── adapters
│
├── tools/
│   ├── filesystem
│   ├── documents
│   ├── knowledge
│   ├── code
│   └── vision
│
├── rag/
│   ├── ingestion
│   ├── embeddings
│   ├── retrieval
│   └── citations
│
├── sandbox/
│   ├── executor
│   └── limits
│
├── artifacts/
│   ├── docx
│   ├── pptx
│   ├── xlsx
│   └── pdf
│
└── security/
    ├── auth
    ├── permissions
    ├── audit
    └── network


---

## Page 15

The frontend should behave like an , not a conventional admin dashboard.
Main areas:
Important UI concepts:
• Conversation
• Task/workspace
• File attachments
• Agent execution timeline
• Tool calls
• Sources
• Generated artifacts
• Model information
• Sovereignty status
The primary SIH demo should be:
→
Workspace
├── New Task
├── Documents
├── Knowledge
├── Artifacts
├── Models
└── Activity
Main Area
└── Conversation
Context
├── Files
├── Sources
└── Artifacts
Bottom
└── Agent Execution Timeline
Scan OCR / Vision Agent Local RAG Reasoning DOCX Verify


---

## Page 16

Detailed workflow:
This single workflow demonstrates:
• Multimodal AI
• Agentic execution
• Model routing
• RAG
• Tool calling
• Document generation
• Verification
• Local processing
Upload scanned inspection report
        ↓
Local OCR/Vision
        ↓
Document extraction
        ↓
Agent creates plan
        ↓
Relevant SOP retrieved from local RAG
        ↓
Reasoning model analyzes findings
        ↓
Recommendation generated
        ↓
Approval note generated as DOCX
        ↓
DOCX validated
        ↓
User reviews artifact


---

## Page 17

This demonstrates genuine agentic iteration.
Example:
Identify the major components visible in this P&ID and explain the flow path.
Use publicly available industrial samples, as specified by the problem statement.
Recommended order:
User:
"Create a Python program to calculate X."
        ↓
Task Router
        ↓
Coding Model
        ↓
Generate Code
        ↓
Sandbox
        ↓
Run Tests
        ↓
FAIL → Fix → Run Again
        ↓
PASS
        ↓
Final Result
P&ID Vision Model Components / Labels Relationships Reasoning Answer
Local Model Backend Router Agent Tools RAG Vision Sandbox Artifacts Security


---

## Page 18

���
���
���
���
���
���
���
���
���
����
����
����
Do not attempt to build every feature simultaneously.
The core technology stack is:
Local Models
     +
Model Routing
     +
Agentic Tools
     +
Multimodal Processing
     +
Local RAG
     +
Artifact Generation
     +
Sandboxed Execution
     +
Verification
     +
Auditability
     +
Sovereignty


---

## Page 19

Intelligence and reasoning
Select appropriate model
Plan and execute tasks
Give the agent capabilities
Provide organizational knowledge
Understand non-text inputs
Safely execute generated code
Produce usable deliverables
Validate results
Control access and execution
Prevent external communication
Make operations traceable


---
