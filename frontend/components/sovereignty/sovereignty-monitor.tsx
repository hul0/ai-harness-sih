"use client"

import React from "react"
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  EyeOff,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
  const { sovereignty, triggerSimulatedEgress } = useWorkbench()

  return (
    <header className="sticky top-0 z-40 flex h-12 w-full items-center justify-between border-b border-border bg-card/95 px-4 md:px-6 backdrop-blur shadow-sm">
      {/* Left: Clear Privacy Status in Blue Theme */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/30">
            <ShieldCheck className="size-4" />
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">
            {branding.logoText}
          </span>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-blue-500" />
          </span>
          <span>100% Private &amp; Offline</span>
        </div>

        <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
          <EyeOff className="size-3.5 text-blue-500" />
          <span>No internet required — your data never leaves this computer</span>
        </span>
      </div>

      {/* Right: Simple privacy confirmation badge & test button */}
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-1.5 rounded-lg border border-border bg-background/80 px-3 py-1 text-xs text-muted-foreground md:flex">
          <CheckCircle2 className="size-3.5 text-blue-500" />
          <span>Completed Tasks:</span>
          <span className="font-semibold text-foreground">{sovereignty.localRequests}</span>
        </div>

        {/* Test Privacy Button */}
        <TooltipProvider delay={150}>
          <Tooltip>
            <TooltipTrigger
              onClick={triggerSimulatedEgress}
              className="inline-flex items-center justify-center rounded-lg border border-primary/30 bg-primary/10 px-3 h-8 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors cursor-pointer gap-1.5 shadow-sm"
            >
              <Lock className="size-3.5" />
              <span>Verify Privacy Shield</span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs max-w-xs p-2">
              Tests and proves that outgoing internet connections are completely blocked by the built-in security shield.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </header>
  )
}
