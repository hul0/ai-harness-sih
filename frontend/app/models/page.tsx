"use client"

import React from "react"
import {
  Sliders,
  Brain,
  Calculator,
  Eye,
  Check,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { mockModelRegistry } from "@/lib/mock-data"
import { useWorkbench } from "@/lib/workbench-context"
import { ModelRole } from "@/types/workbench"
import { cn } from "@/lib/utils"

export default function ModelsPage() {
  const { activeTask } = useWorkbench()

  const getRoleIcon = (role: ModelRole) => {
    switch (role) {
      case "reasoning":
        return <Brain className="size-4 text-muted-foreground" />
      case "coding":
        return <Calculator className="size-4 text-muted-foreground" />
      case "vision":
        return <Eye className="size-4 text-muted-foreground" />
      case "embedding":
        return <Sliders className="size-4 text-muted-foreground" />
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Sliders className="size-4 text-muted-foreground" />
            <span>AI Models &amp; Engine</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Local quantized models loaded into memory depending on task type.
          </p>
        </div>

        <span className="text-xs text-muted-foreground">
          4 Local Engines
        </span>
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mockModelRegistry.map((model) => {
          const isCurrentlyActive = activeTask.routing.modelId === model.id
          return (
            <Card
              key={model.id}
              className={cn(
                "p-4 rounded-xl bg-card transition-colors shadow-none",
                isCurrentlyActive
                  ? "border-emerald-500/40 bg-card"
                  : "border-border/80"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-secondary text-foreground">
                    {getRoleIcon(model.role)}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-foreground">
                      {model.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground">
                      Role: {model.role.toUpperCase()} · VRAM: {model.vramGb} GB
                    </p>
                  </div>
                </div>

                {isCurrentlyActive ? (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-500 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Active
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                    Loaded
                  </span>
                )}
              </div>

              <div className="mt-3 border-t border-border/40 pt-2.5">
                <span className="text-[11px] text-muted-foreground">Supported tasks:</span>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {model.tasks.map((t) => (
                    <span key={t} className="text-[11px] text-foreground bg-secondary px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
