"use client"

import React from "react"
import {
  FileText,
  Download,
  Upload,
  Search,
  Check,
  Table as TableIcon,
  Map,
  FileCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const documentList = [
  {
    name: "MRPL_UT_Thickness_L2041_Scan.pdf",
    type: "Inspection Scan",
    size: "2.4 MB",
    uploaded: "Today at 08:20 PM",
    status: "Processed",
    category: "Crude Overhead Line L-2041",
  },
  {
    name: "MRPL_PID_C101_Distillation.png",
    type: "Plant Drawing",
    size: "4.8 MB",
    uploaded: "Today at 07:15 PM",
    status: "Analyzed",
    category: "Atmospheric Distillation Unit",
  },
  {
    name: "approval_note_L2041.docx",
    type: "Word Note",
    size: "48 KB",
    uploaded: "Today at 08:20 PM",
    status: "Ready for Sign-off",
    category: "Safety Compliance",
  },
  {
    name: "calculation_sheet_L2041.xlsx",
    type: "Excel Sheet",
    size: "26 KB",
    uploaded: "Today at 08:20 PM",
    status: "Verified",
    category: "Safety Calculation",
  },
  {
    name: "orifice_calc.py",
    type: "Python Module",
    size: "8.4 KB",
    uploaded: "Today at 07:40 PM",
    status: "Verified",
    category: "Flow Rate Formula",
  },
]

export default function DocumentsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="size-4 text-muted-foreground" />
            <span>Documents &amp; Files</span>
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Uploaded inspection scans and generated deliverables.
          </p>
        </div>

        <Button size="sm" className="gap-1.5 text-xs rounded-lg font-medium">
          <Upload className="size-3.5" />
          <span>Upload Document</span>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            className="pl-8 text-xs h-9 rounded-lg"
          />
        </div>
        <span className="text-xs text-muted-foreground">
          {documentList.length} files
        </span>
      </div>

      {/* Documents Table */}
      <Card className="border-border/80 rounded-xl overflow-hidden shadow-none bg-card">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Type</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Category</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Size</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
              <TableHead className="text-xs font-medium text-muted-foreground text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentList.map((doc) => (
              <TableRow key={doc.name} className="hover:bg-muted/20">
                <TableCell className="text-xs font-medium text-foreground flex items-center gap-2 py-3">
                  {doc.name.endsWith(".pdf") ? (
                    <FileText className="size-3.5 text-muted-foreground" />
                  ) : doc.name.endsWith(".docx") || doc.name.endsWith(".xlsx") ? (
                    <TableIcon className="size-3.5 text-muted-foreground" />
                  ) : doc.name.endsWith(".png") ? (
                    <Map className="size-3.5 text-muted-foreground" />
                  ) : (
                    <FileCheck className="size-3.5 text-muted-foreground" />
                  )}
                  <span>{doc.name}</span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{doc.type}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{doc.category}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{doc.size}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                    <Check className="size-3" />
                    <span>{doc.status}</span>
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs font-normal rounded-md">
                    <Download className="size-3 text-muted-foreground" />
                    <span>Download</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
