"use client"

import React from "react"
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useWorkbench } from "@/lib/workbench-context"
import { branding } from "@/lib/config"

export function SovereigntyMonitor() {
  const { sovereignty, triggerSimulatedEgress, activeTask } = useWorkbench()

  return (
    <header className="sticky top-0 z-40 flex h-13 w-full items-center justify-between border-b border-border bg-card/80 px-4 md:px-6 backdrop-blur-md">
      {/* Left: Clean Brand & Model Indicator */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-foreground text-background font-bold shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            {branding.logoText}
          </span>
        </div>

        <div className="h-3.5 w-px bg-border" />

        {/* Model Badge */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2.5 py-1 rounded-md border border-border/60">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span className="font-medium text-foreground">{activeTask.routing.modelName.split("(")[0].trim()}</span>
          <span className="text-[11px] text-muted-foreground hidden sm:inline">· Local Engine</span>
        </div>
      </div>

      {/* Right: Clean Privacy Status & Minimal Action */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium text-foreground">Active</span>
          </span>
          <span className="text-border">|</span>
          <span>0 egress calls</span>
        </div>

        <TooltipProvider delay={150}>
          <Tooltip>
            <TooltipTrigger
              onClick={triggerSimulatedEgress}
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg text-foreground hover:bg-muted border border-border transition-colors cursor-pointer"
            >
              <ShieldCheck className="size-3.5 text-emerald-500" />
              <span>Test Shield</span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-xs p-2">
              Validates that outbound internet traffic is fully blocked in this environment.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}
