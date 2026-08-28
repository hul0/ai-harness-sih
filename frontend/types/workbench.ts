export type TaskType = 'inspection' | 'coding' | 'pid_analysis' | 'general' | 'sovereignty_proof'

export type AgentState = 
  | 'INTAKE' 
  | 'CLASSIFY' 
  | 'PLAN' 
  | 'RETRIEVE' 
  | 'TOOL' 
  | 'VERIFY' 
  | 'REPAIR' 
  | 'ARTIFACT' 
  | 'APPROVAL' 
  | 'COMPLETE' 
  | 'FAILED'

export type ModelRole = 'reasoning' | 'coding' | 'vision' | 'embedding'

export interface RoutingReceipt {
  modelId: string
  modelName: string
  role: ModelRole
  reason: string
  isResident: boolean
  contextLength: string
  vramUsageGb: number
}

export interface AgentStep {
  stepId: string
  state: AgentState
  title: string
  description?: string
  tool?: string
  toolInput?: Record<string, unknown> | string
  toolOutput?: Record<string, unknown> | string
  durationMs?: number
  status: 'pending' | 'running' | 'passed' | 'failed' | 'repaired'
  timestamp: string
}

export interface SOPCitation {
  id: string
  source: string        // e.g. "SOP-ENG-042"
  title: string         // e.g. "Refinery Pipeline Inspection & Wall Thickness Tolerance"
  section: string       // e.g. "Section 4.2"
  page: number          // e.g. 17
  snippet: string
  confidence: number
  matchedClause: string
  toleranceRequired: string
}

export interface ArtifactDeliverable {
  id: string
  filename: string
  fileType: 'docx' | 'xlsx' | 'pptx' | 'py' | 'json' | 'pdf'
  fileSizeFormatted: string
  downloadUrl: string
  validationStatus: 'validated' | 'warning' | 'error'
  validationMessage?: string
  summary: string
  generatedAt: string
}

export interface PIDNode {
  id: string
  tag: string           // e.g. "FCV-101"
  symbolType: 'control_valve' | 'centrifugal_pump' | 'distillation_column' | 'heat_exchanger' | 'pressure_transmitter' | 'storage_tank' | 'check_valve'
  label: string
  bbox: [number, number, number, number] // [x, y, width, height] in percentage 0-100
  confidence: number
  lineAssociation?: string
  status?: 'nominal' | 'alert' | 'unverified'
}

export interface PIDEdge {
  id: string
  fromNodeId: string
  toNodeId: string
  lineType: 'process_pipe' | 'instrument_line' | 'electrical_signal' | 'steam_line'
  lineTag: string
  flowDirection: 'forward' | 'bidirectional'
  confidence: number
}

export interface PIDGraph {
  drawingId: string
  drawingTitle: string
  standard: string      // e.g. "ISA-5.1"
  nodes: PIDNode[]
  edges: PIDEdge[]
  overlayImageUrl: string
  flowNarrative: string
  equipmentCount: {
    valves: number
    pumps: number
    vessels: number
    instruments: number
  }
}

export interface SovereigntyMetrics {
  isAirGapped: boolean
  internetBlocked: boolean
  externalApiCalls: number
  externalDnsQueries: number
  externalConnections: number
  localRequests: number
  statusText: string
  activeFirewallRules: number
  lastBlockedPacket?: {
    timestamp: string
    destination: string
    protocol: string
    process: string
    reason: string
  }
}

export interface ApprovalData {
  recommendation: string
  rationale: string
  standardRef: string
  measuredValue: string
  thresholdValue: string
  complianceStatus: 'REJECT' | 'APPROVE' | 'CONDITIONAL'
  deliverablesPending: string[]
  reviewerRoleRequired: string
}

export interface TaskState {
  taskId: string
  scenarioKey: 'inspection_report' | 'sandbox_repair' | 'sovereignty_proof' | 'pid_analysis'
  scenarioTitle: string
  userPrompt: string
  taskType: TaskType
  currentState: AgentState
  routing: RoutingReceipt
  steps: AgentStep[]
  citations: SOPCitation[]
  artifacts: ArtifactDeliverable[]
  pidGraph?: PIDGraph | null
  approvalData?: ApprovalData | null
  requiresApproval: boolean
  approvalStatus?: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export interface ModelRegistryItem {
  id: string
  name: string
  role: ModelRole
  tasks: string[]
  contextLength: number
  quantization: string
  vramGb: number
  isResident: boolean
  priority: number
}
