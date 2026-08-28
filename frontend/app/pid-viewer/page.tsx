"use client"

import React, { useState } from "react"
import {
  Map,
  Layers,
  Search,
  Download,
  Info,
  CheckCircle2,
  FileText,
  Sliders,
  Filter,
} from "lucide-react"
import { PIDGraphViewer } from "@/components/pid/pid-graph-viewer"
import { pidDiagramsList } from "@/lib/pid-data"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function PIDViewerPage() {
  const [selectedDrawingId, setSelectedDrawingId] = useState<string>(pidDiagramsList[0].drawingId)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const activeGraph = pidDiagramsList.find((d) => d.drawingId === selectedDrawingId) || pidDiagramsList[0]

  const categories = ["All", "Primary Separation", "Hydroprocessing", "Overhead System", "Engineering Standards"]

  const filteredDiagrams = pidDiagramsList.filter((d) => {
    const matchesCategory = selectedCategory === "All" || d.category === selectedCategory
    const matchesSearch =
      d.drawingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.drawingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(activeGraph, null, 2))
    const downloadAnchor = document.createElement("a")
    downloadAnchor.setAttribute("href", dataStr)
    downloadAnchor.setAttribute("download", `${activeGraph.drawingId}_graph.json`)
    document.body.appendChild(downloadAnchor)
    downloadAnchor.click()
    downloadAnchor.remove()
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Map className="size-4 text-muted-foreground" />
            <span>Piping &amp; Instrumentation Diagrams (P&amp;ID Explorer)</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Interactive plant CAD drawings, ISA-5.1 symbology taxonomy, and process connectivity graphs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportJSON}
            className="gap-1.5 text-xs font-medium rounded-lg h-8"
          >
            <Download className="size-3.5" />
            <span>Export Graph JSON</span>
          </Button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-3.5 bg-card border-border/80 rounded-xl shadow-none">
          <span className="text-[11px] text-muted-foreground">Available Diagrams</span>
          <p className="text-lg font-semibold text-foreground mt-0.5">{pidDiagramsList.length} Units</p>
          <span className="text-[11px] text-muted-foreground">Refinery &amp; Utility</span>
        </Card>

        <Card className="p-3.5 bg-card border-border/80 rounded-xl shadow-none">
          <span className="text-[11px] text-muted-foreground">Current Unit Equipment</span>
          <p className="text-lg font-semibold text-foreground mt-0.5">{activeGraph.nodes.length} Items</p>
          <span className="text-[11px] text-muted-foreground">Tagged &amp; Bounded</span>
        </Card>

        <Card className="p-3.5 bg-card border-border/80 rounded-xl shadow-none">
          <span className="text-[11px] text-muted-foreground">Piping &amp; Loops</span>
          <p className="text-lg font-semibold text-foreground mt-0.5">{activeGraph.edges.length} Connections</p>
          <span className="text-[11px] text-muted-foreground">Process &amp; Signals</span>
        </Card>

        <Card className="p-3.5 bg-card border-border/80 rounded-xl shadow-none">
          <span className="text-[11px] text-muted-foreground">Standard Architecture</span>
          <p className="text-lg font-semibold text-foreground mt-0.5">ISA-5.1</p>
          <span className="text-[11px] text-emerald-500 font-medium">Auto-OCR Verified</span>
        </Card>
      </div>

      {/* Category Filter Pills & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1 rounded-lg text-xs font-medium transition-colors border",
                selectedCategory === cat
                  ? "bg-foreground text-background border-foreground font-semibold"
                  : "bg-background/60 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plant diagrams..."
            className="pl-8 h-8 text-xs rounded-lg"
          />
        </div>
      </div>

      {/* Diagrams Grid Switcher Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {filteredDiagrams.map((d) => {
          const isSelected = selectedDrawingId === d.drawingId
          return (
            <Card
              key={d.drawingId}
              onClick={() => setSelectedDrawingId(d.drawingId)}
              className={cn(
                "p-3.5 rounded-xl cursor-pointer transition-all shadow-none border text-left",
                isSelected
                  ? "border-emerald-500/50 bg-card ring-1 ring-emerald-500/30"
                  : "border-border/80 bg-card/60 hover:border-border hover:bg-card"
              )}
            >
              <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
                <span className="font-mono">{d.drawingId}</span>
                <span className="bg-secondary px-1.5 py-0.5 rounded text-[10px] text-foreground">
                  {d.nodes.length} tags
                </span>
              </div>

              <h4 className="text-xs font-semibold text-foreground leading-snug line-clamp-1">
                {d.drawingTitle}
              </h4>

              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {d.description}
              </p>
            </Card>
          )
        })}
      </div>

      {/* Active P&ID Interactive Workbench View */}
      <Card className="border-border/80 p-4 md:p-6 bg-card rounded-2xl shadow-none">
        <PIDGraphViewer graphData={activeGraph} isFullScreen={true} />
      </Card>
    </div>
  )
}
