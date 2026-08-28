"use client"

import React from "react"
import { PIDGraphViewer } from "@/components/pid/pid-graph-viewer"
import { useWorkbench } from "@/lib/workbench-context"
import { scenario4_PIDAnalysis } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Map } from "lucide-react"

export default function PIDViewerPage() {
  const { activeTask } = useWorkbench()
  const graph = activeTask.pidGraph || scenario4_PIDAnalysis.pidGraph

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Map className="size-4 text-muted-foreground" />
            <span>Plant Diagrams &amp; P&amp;ID Explorer</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interactive diagram inspection, equipment identification, and flow tracing.
          </p>
        </div>
      </div>

      <Card className="border-border/80 p-5 bg-card rounded-xl shadow-none">
        <PIDGraphViewer graphData={graph} isFullScreen={true} />
      </Card>
    </div>
  )
}
