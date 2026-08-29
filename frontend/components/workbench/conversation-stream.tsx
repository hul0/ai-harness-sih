"use client"

import React, { useState } from "react"
import {
  ArrowUp,
  Paperclip,
  User,
  Sparkles,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
        return { name: "MRPL_UT_Thickness_L2041_Scan.pdf", size: "2.4 MB", type: "Ultrasonic Scan" }
      case "sandbox_repair":
        return { name: "test_orifice_boundary.py", size: "3.1 KB", type: "Calculation Script" }
      case "pid_analysis":
        return { name: "MRPL_PID_C101_Distillation.png", size: "4.8 MB", type: "P&ID Drawing" }
      case "sovereignty_proof":
        return { name: "network_security_policy.conf", size: "1.2 KB", type: "Policy Config" }
      default:
        return null
    }
  }

  const attachedFile = getScenarioAttachedFile()

  return (
    <div className="flex flex-1 flex-col h-full overflow-hidden bg-background">
      {/* Scrollable Conversation Thread */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* User Message */}
          <div className="flex items-start gap-3.5 justify-end">
            <div className="max-w-xl space-y-2">
              <div className="rounded-2xl bg-secondary px-4 py-3 text-sm text-foreground shadow-sm">
                <p className="leading-relaxed">
                  {activeTask.userPrompt}
                </p>

                {attachedFile && (
                  <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                    <FileText className="size-3.5 text-foreground shrink-0" />
                    <span className="font-medium text-foreground truncate">{attachedFile.name}</span>
                    <span className="text-[11px]">({attachedFile.size})</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Response Stream */}
          <div className="flex items-start gap-3.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-foreground text-background font-bold mt-0.5 shadow-sm">
              <Sparkles className="size-3.5" />
            </div>

            <div className="flex-1 min-w-0 space-y-3">
              {/* Clean Routing Receipt */}
              <RoutingReceiptBadge routing={activeTask.routing} />

              {/* Step Progression Accordion */}
              <AgentStepAccordion steps={activeTask.steps} />

              {/* Human Approval Gate if applicable */}
              {activeTask.requiresApproval && <ApprovalGate />}
            </div>
          </div>
        </div>
      </div>

      {/* ChatGPT-style Sleek Capsule Input */}
      <div className="p-4 bg-background/80 backdrop-blur shrink-0 border-t border-border/40">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card shadow-sm transition-all focus-within:border-foreground/30 focus-within:ring-1 focus-within:ring-foreground/20">
            <Textarea
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a question or request adjustments..."
              className="min-h-[52px] max-h-32 resize-none border-0 bg-transparent px-4 pt-3 pb-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-0 shadow-none"
              rows={1}
            />

            <div className="flex items-center justify-between px-3 pb-2.5 pt-0.5">
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
                title="Attach file"
              >
                <Paperclip className="size-4" />
              </Button>

              <Button
                size="sm"
                disabled={!inputVal.trim()}
                className="size-8 p-0 rounded-full bg-foreground text-background hover:bg-foreground/90 disabled:opacity-30 disabled:hover:bg-foreground transition-opacity"
              >
                <ArrowUp className="size-4" />
              </Button>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[11px] text-muted-foreground">
              Indigent AI can assist with inspections, calculations, and official documentation.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
