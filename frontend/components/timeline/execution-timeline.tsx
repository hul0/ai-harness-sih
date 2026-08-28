"use client"

import React from "react"
import {
  CheckCircle2,
  Play,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useWorkbench } from "@/lib/workbench-context"
import { AgentStep } from "@/types/workbench"
import { cn } from "@/lib/utils"

export function ExecutionTimeline() {
  const { activeTask } = useWorkbench()
  const { steps, currentState } = activeTask

  const getStatusDisplay = () => {
    switch (currentState) {
      case "APPROVAL":
        return { label: "Waiting for Your Approval", className: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300" }
      case "COMPLETE":
        return { label: "Completed Successfully", className: "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400" }
      case "FAILED":
        return { label: "Action Stopped / Declined", className: "border-destructive/40 bg-destructive/10 text-destructive" }
      default:
        return { label: "In Progress", className: "border-primary/40 bg-primary/10 text-primary" }
    }
  }

  const statusInfo = getStatusDisplay()

  const renderStepStatusIcon = (step: AgentStep) => {
    switch (step.status) {
      case "passed":
        return <CheckCircle2 className="size-4 text-blue-500 shrink-0" />
      case "repaired":
        return <CheckCircle2 className="size-4 text-primary shrink-0" />
      case "failed":
        return <AlertCircle className="size-4 text-destructive shrink-0" />
      case "running":
        return <Play className="size-4 animate-pulse text-amber-500 shrink-0" />
      default:
        return <Clock className="size-4 text-muted-foreground shrink-0" />
    }
  }

  return (
    <footer className="sticky bottom-0 z-30 flex h-12 w-full items-center border-t border-border bg-card/95 px-4 backdrop-blur shadow-sm">
      <div className="flex shrink-0 items-center gap-2 pr-4 border-r border-border">
        <span className="text-xs font-bold text-foreground hidden sm:inline">
          Progress:
        </span>
        <Badge variant="outline" className={cn("text-xs font-semibold px-2.5 py-0.5", statusInfo.className)}>
          {statusInfo.label}
        </Badge>
      </div>

      {/* Stepper Scroll Container */}
      <ScrollArea className="flex-1 whitespace-nowrap px-3">
        <div className="flex items-center gap-3 py-1">
          {steps.map((step, idx) => (
            <React.Fragment key={step.stepId}>
              <div
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-1 text-xs transition-colors",
                  step.status === "passed" && "border-blue-500/30 bg-blue-500/5 text-foreground font-medium",
                  step.status === "repaired" && "border-primary/30 bg-primary/5 text-foreground font-medium",
                  step.status === "failed" && "border-destructive/30 bg-destructive/5 text-destructive font-medium",
                  step.status === "running" && "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300 font-semibold",
                  step.status === "pending" && "border-border bg-muted/40 text-muted-foreground"
                )}
              >
                {renderStepStatusIcon(step)}
                <span>Step {idx + 1}: {step.title}</span>
              </div>

              {idx < steps.length - 1 && (
                <div className="h-0.5 w-3 bg-border shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>

      {/* Security Assurance pill */}
      <div className="hidden shrink-0 items-center gap-1.5 pl-4 border-l border-border text-xs text-muted-foreground lg:flex">
        <ShieldCheck className="size-4 text-blue-500" />
        <span className="font-medium text-foreground">Verified Private</span>
      </div>
    </footer>
  )
}
