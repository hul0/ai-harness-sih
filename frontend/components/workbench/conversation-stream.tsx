"use client"

import React, { useState } from "react"
import {
  Send,
  Paperclip,
  User,
  Sparkles,
  FileText,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useWorkbench } from "@/lib/workbench-context"
import { RoutingReceiptBadge } from "./routing-receipt-badge"
import { AgentStepAccordion } from "./agent-step-accordion"
import { ApprovalGate } from "./approval-gate"

export function ConversationStream() {
  const { activeTask, scenarioKey } = useWorkbench()
  const [inputVal, setInputVal] = useState("")

  const getScenarioAttachedFile = () => {
    switch (scenarioKey) {
      case "inspection_report":
        return { name: "MRPL_UT_Thickness_L2041_Scan.pdf", size: "2.4 MB", type: "Ultrasonic Thickness Report" }
      case "sandbox_repair":
        return { name: "test_orifice_boundary.py", size: "3.1 KB", type: "Calculation Test Script" }
      case "pid_analysis":
        return { name: "MRPL_PID_C101_Distillation.png", size: "4.8 MB", type: "Plant Layout Drawing" }
      case "sovereignty_proof":
        return { name: "network_security_policy.conf", size: "1.2 KB", type: "Privacy Rule Document" }
      default:
        return null
    }
  }

  const attachedFile = getScenarioAttachedFile()

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden bg-background">
      {/* Scrollable Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        {/* User Prompt Message */}
        <div className="flex items-start gap-4 max-w-4xl mx-auto">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground border border-border shadow-sm">
            <User className="size-5" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">You (Officer in Charge)</span>
              <span className="text-xs text-muted-foreground">{activeTask.createdAt}</span>
            </div>
            
            <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-sm md:text-base text-foreground leading-relaxed">
                {activeTask.userPrompt}
              </p>

              {attachedFile && (
                <div className="mt-3.5 flex flex-wrap items-center gap-2 pt-3 border-t border-border/60">
                  <Badge variant="outline" className="gap-2 py-1.5 px-3 text-xs font-semibold text-foreground bg-background rounded-lg border-primary/30">
                    <FileText className="size-4 text-primary" />
                    <span>{attachedFile.name}</span>
                    <span className="text-muted-foreground font-normal">({attachedFile.size})</span>
                  </Badge>
                  <span className="text-xs text-muted-foreground">{attachedFile.type}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Agent Execution & Progress */}
        <div className="flex items-start gap-4 max-w-4xl mx-auto">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/25">
            <Sparkles className="size-5" />
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="font-bold text-sm text-foreground">Saarthi AI Assistant</span>
              <Badge variant="secondary" className="text-xs font-medium">Automatic Workplace Workflow</Badge>
            </div>

            {/* Model Routing Receipt in Plain English */}
            <RoutingReceiptBadge routing={activeTask.routing} />

            {/* Step Progression Accordion */}
            <AgentStepAccordion steps={activeTask.steps} />

            {/* Human Approval Gate */}
            {activeTask.requiresApproval && <ApprovalGate />}
          </div>
        </div>
      </div>

      {/* Bottom Input Box */}
      <div className="border-t border-border bg-card/60 p-4 shrink-0">
        <div className="max-w-4xl mx-auto space-y-2.5">
          <div className="relative rounded-2xl border border-border bg-background shadow-sm focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary">
            <Textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a question, upload a new report, or request adjustments to this document..."
              className="min-h-[56px] max-h-32 resize-none border-0 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
              rows={2}
            />

            <div className="flex items-center justify-between px-3 pb-3 pt-1">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 gap-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                  <Paperclip className="size-4" />
                  <span>Attach Document or Photo</span>
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground hidden sm:inline flex items-center gap-1">
                  <ShieldCheck className="size-3.5 text-blue-500 inline" />
                  100% Private Local Processing
                </span>
                <Button size="default" className="h-8 gap-2 px-4 text-xs font-bold rounded-lg shadow-sm">
                  <Send className="size-3.5" />
                  <span>Send Request</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
