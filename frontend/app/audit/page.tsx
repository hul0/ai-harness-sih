"use client"

import React from "react"
import {
  History,
  Download,
  Check,
  AlertTriangle,
  Shield,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const auditEntries = [
  {
    id: "LOG-1092",
    timestamp: "Today at 08:20 PM",
    action: "Paused for Officer Approval",
    actor: "Approval Gate",
    status: "Pending",
    details: "Completed pipe calculation and prepared official note for review.",
  },
  {
    id: "LOG-1091",
    timestamp: "Today at 08:20 PM",
    action: "Generated Word & Excel Deliverables",
    actor: "Document Generator",
    status: "Completed",
    details: "Created approval_note_L2041.docx and calculation_sheet_L2041.xlsx.",
  },
  {
    id: "LOG-1090",
    timestamp: "Today at 08:20 PM",
    action: "Safety Threshold Calculation",
    actor: "Arithmetic Engine",
    status: "Completed",
    details: "Calculated measured 3.8 mm vs 4.5 mm limit. Flagged non-compliant.",
  },
  {
    id: "LOG-1089",
    timestamp: "Today at 08:20 PM",
    action: "Matched Safety Rule",
    actor: "RAG Retrieval",
    status: "Completed",
    details: "Matched SOP-ENG-042 Section 4.2 (Page 17) with 98% confidence.",
  },
  {
    id: "LOG-1088",
    timestamp: "Today at 08:10 PM",
    action: "Blocked Egress Attempt",
    actor: "Security Shield",
    status: "Blocked",
    details: "Simulated outbound connection dropped at socket layer. Zero bytes egressed.",
  },
]

export default function AuditPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <History className="size-4 text-muted-foreground" />
            <span>Audit &amp; Security Log</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable log of state transitions, rule evaluations, and network actions.
          </p>
        </div>

        <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium rounded-lg">
          <Download className="size-3.5" />
          <span>Export JSONL</span>
        </Button>
      </div>

      {/* Audit Log Table */}
      <Card className="border-border/80 rounded-xl overflow-hidden shadow-none bg-card">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-medium text-muted-foreground">Time</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Action</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Module</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditEntries.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-muted/20">
                <TableCell className="text-xs text-muted-foreground font-mono py-3">
                  {entry.timestamp}
                </TableCell>
                <TableCell className="text-xs font-semibold text-foreground">
                  {entry.action}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {entry.actor}
                </TableCell>
                <TableCell>
                  {entry.status === "Blocked" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-md">
                      <Shield className="size-3" />
                      <span>{entry.status}</span>
                    </span>
                  ) : entry.status === "Pending" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      <AlertTriangle className="size-3" />
                      <span>{entry.status}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                      <Check className="size-3" />
                      <span>{entry.status}</span>
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground leading-relaxed">
                  {entry.details}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
