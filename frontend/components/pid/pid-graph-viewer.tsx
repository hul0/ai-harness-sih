"use client"

import React, { useState } from "react"
import {
  Map,
  MapPin,
  Sparkles,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkbench } from "@/lib/workbench-context"
import { PIDGraph, PIDNode } from "@/types/workbench"
import { scenario4_PIDAnalysis } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface PIDGraphViewerProps {
  graphData?: PIDGraph | null
  isFullScreen?: boolean
}

export function PIDGraphViewer({ graphData }: PIDGraphViewerProps) {
  const { selectedNode, setSelectedNode } = useWorkbench()
  const graph = graphData || scenario4_PIDAnalysis.pidGraph!
  const [hoveredNode, setHoveredNode] = useState<PIDNode | null>(null)

  const activeNode = selectedNode || hoveredNode

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden text-xs">
      {/* Header Info */}
      <div className="flex items-center justify-between px-0.5">
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Map className="size-3.5 text-muted-foreground" />
            <span>{graph.drawingTitle}</span>
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Ref: {graph.drawingId}
          </p>
        </div>
        <span className="text-[11px] text-muted-foreground">
          {graph.nodes.length} Components
        </span>
      </div>

      {/* Interactive Diagram Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[300px] rounded-xl border border-border/80 bg-neutral-950 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />

        {/* Process Pipelines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
            </marker>
          </defs>
          {/* Main Process Line */}
          <path
            d="M 15% 56% L 33% 56% L 49% 56% L 77% 50%"
            fill="none"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeDasharray="4 2"
            markerEnd="url(#arrow)"
          />
          {/* Reflux loop */}
          <path
            d="M 77% 25% L 92% 25% L 92% 73% L 80% 84% L 77% 84%"
            fill="none"
            stroke="#737373"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          {/* Pressure Instrument signal */}
          <path
            d="M 33% 56% L 42% 36%"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
        </svg>

        {/* Interactive Equipment Node Hotspots */}
        {graph.nodes.map((node) => {
          const isSelected = selectedNode?.id === node.id
          const isHovered = hoveredNode?.id === node.id
          const [left, top, width, height] = node.bbox

          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(isSelected ? null : node)}
              onMouseEnter={() => setHoveredNode(node)}
              onMouseLeave={() => setHoveredNode(null)}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
              className={cn(
                "absolute flex flex-col items-center justify-center rounded border transition-all cursor-pointer select-none",
                isSelected
                  ? "border-emerald-400 bg-emerald-500/20 ring-2 ring-emerald-400/40 z-20"
                  : isHovered
                  ? "border-amber-400 bg-amber-400/20 z-10"
                  : "border-neutral-600 bg-neutral-900/70 hover:border-neutral-400"
              )}
            >
              <span className="text-[10px] font-semibold text-neutral-200 bg-neutral-900/90 px-1 py-0.2 rounded border border-neutral-700">
                {node.tag}
              </span>
            </button>
          )
        })}

        {/* Active Node Callout */}
        {activeNode && (
          <div className="absolute bottom-2 left-2 z-30 flex items-center gap-1.5 rounded-lg border border-border bg-neutral-900/95 px-2.5 py-1.5 text-xs shadow-md backdrop-blur">
            <MapPin className="size-3 text-emerald-400 shrink-0" />
            <div>
              <span className="font-semibold text-foreground">{activeNode.tag}</span>: {activeNode.label}
            </div>
          </div>
        )}
      </div>

      {/* Equipment List & Flow Breakdown */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <div className="rounded-xl border border-border/80 bg-background/80 p-3">
          <span className="text-[11px] font-medium text-muted-foreground">
            Components
          </span>
          <ScrollArea className="h-28 mt-1.5 pr-2">
            <div className="space-y-1">
              {graph.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-xs transition-colors",
                      isSelected
                        ? "bg-secondary text-foreground font-medium"
                        : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="font-semibold text-foreground">{node.tag}</span>
                      <span className="text-muted-foreground truncate">{node.label}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Flow Story */}
        <div className="rounded-xl border border-border/80 bg-background/80 p-3 flex flex-col">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-muted-foreground">
              Flow Summary
            </span>
          </div>
          <ScrollArea className="h-28 text-[11px] text-muted-foreground leading-relaxed pr-2">
            <p className="whitespace-pre-line">{graph.flowNarrative}</p>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
