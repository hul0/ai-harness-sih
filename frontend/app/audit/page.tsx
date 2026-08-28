"use client"

import React from "react"
import {
  History,
  Download,
  CheckCircle2,
  ShieldCheck,
  Lock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
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
    action: "Waited for Officer Approval",
    actor: "Safety Gate Guard",
    status: "Action Pending",
    details: "The assistant completed the pipe report and paused for the engineer's signature.",
  },
  {
    id: "LOG-1091",
    timestamp: "Today at 08:20 PM",
    action: "Generated Official Word & Excel Files",
    actor: "Document Generator",
    status: "Completed",
    details: "Created approval_note_L2041.docx and calculation_sheet_L2041.xlsx for inspection.",
  },
  {
    id: "LOG-1090",
    timestamp: "Today at 08:20 PM",
    action: "Performed Safety Math Check",
    actor: "Arithmetic Verifier",
    status: "Completed",
    details: "Calculated measured 3.8 mm vs required 4.5 mm threshold. Flagged as non-compliant.",
  },
  {
    id: "LOG-1089",
    timestamp: "Today at 08:20 PM",
    action: "Found Official Safety Rule",
    actor: "Guidelines Search",
    status: "Completed",
    details: "Found SOP-ENG-042 Section 4.2 (Page 17) in company guidelines with 98% accuracy match.",
  },
  {
    id: "LOG-1088",
    timestamp: "Today at 08:10 PM",
    action: "Blocked Outside Internet Attempt",
    actor: "Privacy Shield",
    status: "Blocked & Protected",
    details: "Outside website connection attempt was blocked instantly. 0 bytes left this computer.",
  },
]

export default function AuditPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
            <History className="size-5 text-primary" />
            <span>Activity History &amp; Security Log</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            A clear, permanent record of every document checked, safety rule matched, and calculation verified.
          </p>
        </div>

        <Button variant="outline" size="default" className="gap-2 text-xs font-bold rounded-xl shadow-sm">
          <Download className="size-4" />
          <span>Download Activity Report</span>
        </Button>
      </div>

      {/* Audit Log Table */}
      <Card className="border-border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">Time</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Action Performed</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Module</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Explanation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditEntries.map((entry) => (
              <TableRow key={entry.id} className="hover:bg-muted/30">
                <TableCell className="text-xs text-muted-foreground font-medium py-3.5">
                  {entry.timestamp}
                </TableCell>
                <TableCell className="text-sm font-bold text-foreground">
                  {entry.action}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {entry.actor}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      entry.status === "Blocked & Protected"
                        ? "text-xs font-semibold text-destructive border-destructive/30 bg-destructive/10"
                        : entry.status === "Action Pending"
                        ? "text-xs font-semibold text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10"
                        : "text-xs font-semibold text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10"
                    }
                  >
                    {entry.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-foreground/90 leading-relaxed">
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
