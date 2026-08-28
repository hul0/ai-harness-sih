"use client"

import React from "react"
import { PIDGraphViewer } from "@/components/pid/pid-graph-viewer"
import { useWorkbench } from "@/lib/workbench-context"
import { scenario4_PIDAnalysis } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Map } from "lucide-react"

export default function PIDViewerPage() {
  const { activeTask } = useWorkbench()
  const graph = activeTask.pidGraph || scenario4_PIDAnalysis.pidGraph

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
            <Map className="size-5 text-primary" />
            <span>Plant Diagrams &amp; Equipment Explorer</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Click on any valve or pump to highlight its location on the diagram and read how liquid flows.
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-semibold text-primary border-primary/30 px-3 py-1">
          Visual Assistant Active
        </Badge>
      </div>

      <Card className="border-border p-6 bg-card rounded-2xl shadow-sm">
        <PIDGraphViewer graphData={graph} isFullScreen={true} />
      </Card>
    </div>
  )
}
