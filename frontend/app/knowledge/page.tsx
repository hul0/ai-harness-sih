"use client"

import React from "react"
import {
  BookOpen,
  Upload,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

const sopList = [
  {
    code: "SOP-ENG-042",
    title: "Static Equipment & Piping Retirement Thickness Standards",
    chunks: 48,
    lastIndexed: "Today at 06:30 PM",
    category: "Refinery Safety Guidelines",
    description: "Defines the allowable corrosion loss, retirement wall thickness limits, and mandatory actions when a pipe is too thin.",
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
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
            <BookOpen className="size-5 text-primary" />
            <span>Company Guidelines &amp; Safety Manuals (SOPs)</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Official refinery manuals used by the AI assistant to verify measurements and ensure compliance.
          </p>
        </div>

        <Button size="default" className="gap-2 font-bold text-xs rounded-xl shadow-sm">
          <Upload className="size-4" />
          <span>Add New Company Rule / SOP</span>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="border-border p-5 bg-card rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Indexed Safety Rules</span>
            <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400 border-blue-500/30">
              Active
            </Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">148 Clauses</p>
          <span className="text-xs text-muted-foreground">Across 3 Official Manuals</span>
        </Card>

        <Card className="border-border p-5 bg-card rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Verification Accuracy</span>
            <Badge variant="outline" className="text-xs text-primary border-primary/30">
              100% Traceable
            </Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">Exact Page Matches</p>
          <span className="text-xs text-muted-foreground">Every recommendation cites exact section</span>
        </Card>

        <Card className="border-border p-5 bg-card rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-muted-foreground">Privacy Protection</span>
            <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400 border-blue-500/30">
              On-Device Only
            </Badge>
          </div>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">Strictly Private</p>
          <span className="text-xs text-muted-foreground">Manuals never leave this device</span>
        </Card>
      </div>

      {/* Ingested Manuals List */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">
          Active Company Manuals &amp; Guidelines
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {sopList.map((sop) => (
            <Card key={sop.code} className="border-border bg-card p-5 rounded-2xl shadow-sm hover:border-primary/40 transition-colors">
              <div className="flex items-start justify-between gap-2">
                <Badge variant="secondary" className="text-xs text-primary font-bold px-2.5 py-1">
                  {sop.code}
                </Badge>
                <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold">
                  {sop.chunks} Verified Sections
                </Badge>
              </div>

              <h4 className="mt-3 text-sm font-bold text-foreground leading-snug">
                {sop.title}
              </h4>

              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {sop.description}
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{sop.category}</span>
                <span>Updated: {sop.lastIndexed}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
