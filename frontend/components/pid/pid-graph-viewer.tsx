"use client"

import React, { useState } from "react"
import {
  Map,
  MapPin,
  Sparkles,
  Info,
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
    <div className="flex flex-col h-full gap-4 overflow-hidden">
      {/* Header Info */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Map className="size-4 text-primary" />
            <span>{graph.drawingTitle}</span>
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Drawing Reference: {graph.drawingId}
          </p>
        </div>
        <Badge variant="outline" className="text-xs font-semibold border-primary/30 text-primary">
          {graph.nodes.length} Components Identified
        </Badge>
      </div>

      {/* Interactive Diagram Canvas */}
      <div className="relative w-full aspect-[4/3] max-h-[320px] rounded-2xl border border-border bg-slate-950 overflow-hidden shadow-inner flex items-center justify-center">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-60" />

        {/* Process Pipelines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="oklch(0.511 0.096 186.391)" />
            </marker>
          </defs>
          {/* Main Process Line: V-102 -> P-101A -> FCV-101 -> C-101 */}
          <path
            d="M 15% 56% L 33% 56% L 49% 56% L 77% 50%"
            fill="none"
            stroke="oklch(0.511 0.096 186.391)"
            strokeWidth="3.5"
            strokeDasharray="5 3"
            markerEnd="url(#arrow)"
          />
          {/* Reflux loop */}
          <path
            d="M 77% 25% L 92% 25% L 92% 73% L 80% 84% L 77% 84%"
            fill="none"
            stroke="oklch(0.7 0.15 145)"
            strokeWidth="3"
            markerEnd="url(#arrow)"
          />
          {/* Pressure Instrument signal */}
          <path
            d="M 33% 56% L 42% 36%"
            fill="none"
            stroke="oklch(0.75 0.15 75)"
            strokeWidth="2"
            strokeDasharray="4 4"
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
                "absolute flex flex-col items-center justify-center rounded-lg border-2 transition-all cursor-pointer select-none",
                isSelected
                  ? "border-primary bg-primary/30 ring-4 ring-primary/40 shadow-xl z-20"
                  : isHovered
                  ? "border-amber-400 bg-amber-400/25 z-10"
                  : "border-cyan-400/50 bg-cyan-950/50 hover:border-cyan-300"
              )}
            >
              <span className="text-[11px] font-bold text-white bg-black/80 px-1.5 py-0.5 rounded shadow">
                {node.tag}
              </span>
            </button>
          )
        })}

        {/* Active Node Callout */}
        {activeNode && (
          <div className="absolute bottom-3 left-3 z-30 flex items-center gap-2 rounded-xl border border-border bg-background/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
            <MapPin className="size-4 text-primary shrink-0" />
            <div>
              <span className="font-bold text-foreground">{activeNode.tag}</span>: {activeNode.label}
              <span className="text-muted-foreground ml-1.5 font-normal">({activeNode.lineAssociation})</span>
            </div>
          </div>
        )}
      </div>

      {/* Equipment List & Simple Story Breakdown */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card/80 p-3 shadow-sm">
          <span className="text-xs font-bold uppercase text-muted-foreground">
            Equipment on Diagram (Click to View)
          </span>
          <ScrollArea className="h-32 mt-2 pr-2">
            <div className="space-y-1.5">
              {graph.nodes.map((node) => {
                const isSelected = selectedNode?.id === node.id
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(isSelected ? null : node)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors border",
                      isSelected
                        ? "border-primary bg-primary/10 text-foreground font-bold shadow-sm"
                        : "border-transparent hover:bg-muted text-muted-foreground hover:text-foreground font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-primary font-bold">{node.tag}</span>
                      <span className="text-foreground truncate">{node.label}</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {node.lineAssociation}
                    </Badge>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Flow Story */}
        <div className="rounded-xl border border-border bg-card/80 p-3 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              How the Liquid Flows
            </span>
          </div>
          <ScrollArea className="h-32 text-xs text-foreground/90 leading-relaxed pr-2">
            <p className="whitespace-pre-line">{graph.flowNarrative}</p>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
