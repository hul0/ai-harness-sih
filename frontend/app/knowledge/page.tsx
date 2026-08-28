"use client"

import React from "react"
import {
  BookOpen,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const sopList = [
  {
    code: "SOP-ENG-042",
    title: "Static Equipment & Piping Retirement Thickness Standards",
    chunks: 48,
    lastIndexed: "Today at 06:30 PM",
    category: "Safety Guidelines",
    description: "Defines allowable corrosion loss, retirement wall thickness limits, and mandatory replacement protocols.",
  },
  {
    code: "MRPL Safety Policy 2024",
    title: "Refinery Piping Inspection Frequency and Non-Conformance Protocols",
    chunks: 36,
    lastIndexed: "Today at 06:32 PM",
    category: "Safety Regulations",
    description: "Inspection schedules, ultrasonic measurement rules, and formal managerial sign-off requirements.",
  },
  {
    code: "ISA-5.1 Standards",
    title: "Instrumentation Symbols and Identification Standard Manual",
    chunks: 64,
    lastIndexed: "Today at 06:35 PM",
    category: "Engineering Standards",
    description: "Standard definitions for valve symbols, pump tags, and pipeline markers on technical drawings.",
  },
]

export default function KnowledgePage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="size-4 text-muted-foreground" />
            <span>Guidelines &amp; Manuals</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Operating procedures and manuals indexed for verification and safety compliance.
          </p>
        </div>

        <Button size="sm" className="gap-1.5 text-xs font-medium rounded-lg">
          <Upload className="size-3.5" />
          <span>Add Guideline</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="border-border/80 p-4 bg-card rounded-xl shadow-none">
          <span className="text-xs text-muted-foreground">Indexed Rules</span>
          <p className="text-xl font-semibold text-foreground mt-1">148 Clauses</p>
          <span className="text-[11px] text-muted-foreground">Across 3 Manuals</span>
        </Card>

        <Card className="border-border/80 p-4 bg-card rounded-xl shadow-none">
          <span className="text-xs text-muted-foreground">Citation Matching</span>
          <p className="text-xl font-semibold text-foreground mt-1">Exact Section</p>
          <span className="text-[11px] text-muted-foreground">Direct page number references</span>
        </Card>

        <Card className="border-border/80 p-4 bg-card rounded-xl shadow-none">
          <span className="text-xs text-muted-foreground">Index Storage</span>
          <p className="text-xl font-semibold text-foreground mt-1">Local Vector DB</p>
          <span className="text-[11px] text-muted-foreground">Stored on-device</span>
        </Card>
      </div>

      {/* Ingested Manuals List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">
          Active Manuals
        </h3>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {sopList.map((sop) => (
            <Card key={sop.code} className="border-border/80 bg-card p-4 rounded-xl shadow-none hover:border-border transition-colors">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold text-foreground bg-secondary px-2 py-0.5 rounded">
                  {sop.code}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {sop.chunks} sections
                </span>
              </div>

              <h4 className="mt-2 text-xs font-semibold text-foreground leading-snug">
                {sop.title}
              </h4>

              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {sop.description}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
                <span>{sop.category}</span>
                <span>Updated: {sop.lastIndexed}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
