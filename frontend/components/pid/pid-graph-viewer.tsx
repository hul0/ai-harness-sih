"use client"

import React, { useState } from "react"
import {
  Map,
  MapPin,
  Sparkles,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  Activity,
  Maximize2,
  Minimize2,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWorkbench } from "@/lib/workbench-context"
import { PIDGraph, PIDNode } from "@/types/workbench"
import { pidDiagramsList } from "@/lib/pid-data"
import { PIDSchematicSVG } from "@/components/pid/pid-schematic-svg"
import { cn } from "@/lib/utils"

interface PIDGraphViewerProps {
  graphData?: PIDGraph | null
  isFullScreen?: boolean
  showDiagramSelector?: boolean
}

export function PIDGraphViewer({
  graphData,
  isFullScreen = false,
  showDiagramSelector = false,
}: PIDGraphViewerProps) {
  const { selectedNode, setSelectedNode } = useWorkbench()
  const [selectedDiagramId, setSelectedDiagramId] = useState<string>(
    graphData?.drawingId || pidDiagramsList[0].drawingId
  )
  const [hoveredNode, setHoveredNode] = useState<PIDNode | null>(null)
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [showPipelines, setShowPipelines] = useState<boolean>(true)

  const activeGraph =
    (showDiagramSelector
      ? pidDiagramsList.find((d) => d.drawingId === selectedDiagramId)
      : graphData) || pidDiagramsList[0]

  const activeNode = selectedNode || hoveredNode

  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.min(Math.max(0.4, Number((prev + delta).toFixed(2))), 4.0))
  }

  const handleResetZoom = () => {
    setZoomLevel(1)
    setPanOffset({ x: 0, y: 0 })
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88
    setZoomLevel((prev) => Math.min(Math.max(0.4, Number((prev * zoomFactor).toFixed(2))), 4.0))
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return
    setIsDragging(true)
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  return (
    <div className="flex flex-col h-full gap-3 overflow-hidden text-xs">
      {/* Optional Diagram Switcher Tabs */}
      {showDiagramSelector && (
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/40 rounded-xl border border-border/60">
          {pidDiagramsList.map((d) => (
            <button
              key={d.drawingId}
              onClick={() => {
                setSelectedDiagramId(d.drawingId)
                setSelectedNode(null)
                handleResetZoom()
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                selectedDiagramId === d.drawingId
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Map className="size-3.5" />
              <span>{d.drawingTitle.split("(")[0].trim()}</span>
            </button>
          ))}
        </div>
      )}

      {/* Header Info & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div>
          <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Map className="size-3.5 text-muted-foreground" />
            <span>{activeGraph.drawingTitle}</span>
          </h4>
          <p className="text-[11px] text-muted-foreground">
            Standard: {activeGraph.standard} · Ref: {activeGraph.drawingId}
          </p>
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPipelines(!showPipelines)}
            className={cn(
              "h-7 px-2 text-[11px] gap-1 rounded-md",
              showPipelines ? "text-emerald-500 bg-emerald-500/10" : "text-muted-foreground"
            )}
            title="Toggle process pipelines"
          >
            <Layers className="size-3" />
            <span>Pipelines</span>
          </Button>

          <div className="h-3 w-px bg-border mx-0.5" />

          <span className="text-[11px] font-mono text-muted-foreground px-1.5 select-none">
            {Math.round(zoomLevel * 100)}%
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoom(0.2)}
            className="size-7 p-0 text-muted-foreground hover:text-foreground rounded-md"
            title="Zoom In"
          >
            <ZoomIn className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleZoom(-0.2)}
            className="size-7 p-0 text-muted-foreground hover:text-foreground rounded-md"
            title="Zoom Out"
          >
            <ZoomOut className="size-3.5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetZoom}
            className="size-7 p-0 text-muted-foreground hover:text-foreground rounded-md"
            title="Reset Pan & Zoom (or double-click canvas)"
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Interactive Pure Vector CAD Canvas with Drag Pan & Wheel Zoom */}
      <div
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleResetZoom}
        className={cn(
          "relative w-full rounded-xl border border-border/80 bg-neutral-950 overflow-hidden shadow-inner flex items-center justify-center select-none",
          isFullScreen
            ? "aspect-[16/9] min-h-[400px] max-h-[580px]"
            : "aspect-[4/3] min-h-[240px] max-h-[340px]",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
      >
        {/* Subtle CAD grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none" />

        {/* Scalable & Pannable Container for Vector Schematic */}
        <div
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
          className="relative w-full h-full p-3 flex items-center justify-center pointer-events-auto"
        >
          <PIDSchematicSVG
            drawingId={activeGraph.drawingId}
            selectedNodeId={selectedNode?.id || null}
            hoveredNodeId={hoveredNode?.id || null}
            onNodeClick={(id) => {
              const target = activeGraph.nodes.find((n) => n.id === id)
              setSelectedNode(selectedNode?.id === id ? null : target || null)
            }}
            onNodeHover={(id) => {
              const target = activeGraph.nodes.find((n) => n.id === id)
              setHoveredNode(target || null)
            }}
            showPipelines={showPipelines}
          />
        </div>

        {/* Active Node Callout Banner */}
        {activeNode && (
          <div className="absolute bottom-2 left-2 z-40 flex items-center gap-2 rounded-lg border border-border bg-neutral-900/95 px-2.5 py-1.5 text-xs shadow-lg backdrop-blur max-w-md pointer-events-none">
            <MapPin className="size-3 text-emerald-400 shrink-0" />
            <div className="min-w-0">
              <span className="font-semibold text-foreground">{activeNode.tag}</span>: {activeNode.label}
              {activeNode.lineAssociation && (
                <span className="text-muted-foreground ml-1.5 text-[10px]">({activeNode.lineAssociation})</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Inspector: Component Tree & Flow Narrative */}
      <div className={cn(
        "grid gap-2.5",
        isFullScreen ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
      )}>
        {/* Component Tree */}
        <div className="rounded-xl border border-border/80 bg-background/80 p-2.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-medium text-muted-foreground">
              Components ({activeGraph.nodes.length})
            </span>
            <span className="text-[10px] text-muted-foreground">Click to inspect</span>
          </div>

          <ScrollArea className={cn(isFullScreen ? "h-32" : "h-24", "pr-2")}>
            <div className="space-y-1">
              {activeGraph.nodes.map((node) => {
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
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-foreground">{node.tag}</span>
                      <span className="text-muted-foreground truncate">{node.label}</span>
                    </div>
                    {node.lineAssociation && (
                      <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded shrink-0">
                        {node.lineAssociation.split("-")[0] || "Process"}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Flow Narrative */}
        {isFullScreen && (
          <div className="rounded-xl border border-border/80 bg-background/80 p-2.5 flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                <Activity className="size-3 text-emerald-500" />
                Process Flow &amp; Instrumentation
              </span>
            </div>

            <ScrollArea className="h-32 text-[11px] text-muted-foreground leading-relaxed pr-2">
              <p className="whitespace-pre-line">{activeGraph.flowNarrative}</p>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  )
}
