"use client"

import React from "react"
import {
  CheckCircle2,
  AlertCircle,
  Play,
  FileText,
  Search,
  Calculator,
  FileSpreadsheet,
  Layers,
} from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { AgentStep } from "@/types/workbench"

interface AgentStepAccordionProps {
  steps: AgentStep[]
}

export function AgentStepAccordion({ steps }: AgentStepAccordionProps) {
  const getStatusBadge = (status: AgentStep["status"]) => {
    switch (status) {
      case "passed":
        return (
          <Badge variant="outline" className="gap-1 border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <CheckCircle2 className="size-3.5" />
            Completed
          </Badge>
        )
      case "repaired":
        return (
          <Badge variant="outline" className="gap-1 border-primary/30 bg-primary/10 text-primary text-xs font-semibold">
            <CheckCircle2 className="size-3.5" />
            Auto-Corrected
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="outline" className="gap-1 border-destructive/30 bg-destructive/10 text-destructive text-xs font-semibold">
            <AlertCircle className="size-3.5" />
            Issue Found
          </Badge>
        )
      case "running":
        return (
          <Badge variant="outline" className="gap-1 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300 text-xs font-semibold animate-pulse">
            <Play className="size-3.5" />
            In Progress
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="text-xs">
            Pending
          </Badge>
        )
    }
  }

  const getStepIcon = (title: string) => {
    if (title.toLowerCase().includes("read") || title.toLowerCase().includes("scan")) return <FileText className="size-4 text-blue-500" />
    if (title.toLowerCase().includes("sop") || title.toLowerCase().includes("rule")) return <Search className="size-4 text-primary" />
    if (title.toLowerCase().includes("calc") || title.toLowerCase().includes("math")) return <Calculator className="size-4 text-blue-400" />
    if (title.toLowerCase().includes("document") || title.toLowerCase().includes("word") || title.toLowerCase().includes("excel")) return <FileSpreadsheet className="size-4 text-primary" />
    return <Layers className="size-4 text-primary" />
  }

  return (
    <div className="my-4 flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Step-by-Step Task Execution ({steps.length} Steps)
        </span>
        <span className="text-xs text-muted-foreground">Every step is verified</span>
      </div>

      <Accordion multiple defaultValue={["step-1", "step-2", "step-3", "step-4", "step-5", "step-6"]} className="space-y-2.5 border-none">
        {steps.map((step, idx) => (
          <AccordionItem
            key={step.stepId}
            value={step.stepId}
            className="rounded-xl border border-border/80 bg-card/70 px-4 shadow-sm transition-all data-open:bg-card"
          >
            <AccordionTrigger className="py-3 hover:no-underline">
              <div className="flex flex-1 items-center justify-between pr-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-lg border border-border bg-background">
                    {getStepIcon(step.title)}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-foreground">
                      Step {idx + 1}: {step.title}
                    </span>
                  </div>
                </div>

                <div>
                  {getStatusBadge(step.status)}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="pt-2 pb-4 text-sm text-foreground/90 leading-relaxed border-t border-border/40 mt-1">
              <p className="p-2 rounded-lg bg-background/60 border border-border/40">
                {step.description}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
