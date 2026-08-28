"use client"

import React from "react"
import {
  Sliders,
  Brain,
  Calculator,
  Eye,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
        return <Brain className="size-5 text-primary" />
      case "coding":
        return <Calculator className="size-5 text-blue-400" />
      case "vision":
        return <Eye className="size-5 text-primary" />
      case "embedding":
        return <Sliders className="size-5 text-blue-500" />
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
            <Sliders className="size-5 text-primary" />
            <span>AI Assistant Information</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your computer automatically picks the right specialized assistant depending on your task.
          </p>
        </div>

        <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold px-3 py-1">
          Running 100% Locally
        </Badge>
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {mockModelRegistry.map((model) => {
          const isCurrentlyActive = activeTask.routing.modelId === model.id
          return (
            <Card
              key={model.id}
              className={cn(
                "p-5 rounded-2xl bg-card transition-all shadow-sm",
                isCurrentlyActive
                  ? "border-primary ring-2 ring-primary/30 shadow-md"
                  : "border-border"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                    {getRoleIcon(model.role)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      {model.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Specialty: {model.role.toUpperCase()}
                    </p>
                  </div>
                </div>

                {isCurrentlyActive ? (
                  <Badge variant="outline" className="gap-1.5 text-xs text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10 font-semibold">
                    <span className="size-2 rounded-full bg-blue-500 animate-pulse" />
                    Currently Helping You
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Ready on Device
                  </Badge>
                )}
              </div>

              <div className="mt-4 border-t border-border/60 pt-3">
                <span className="text-xs font-semibold text-muted-foreground">What this assistant helps with:</span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {model.tasks.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs font-medium px-2.5 py-0.5">
                      {t}
                    </Badge>
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
