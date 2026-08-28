"use client"

import React from "react"
import {
  FileText,
  Download,
  Upload,
  Search,
  CheckCircle2,
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
    status: "Processed (100% Read)",
    category: "Crude Overhead Line L-2041",
  },
  {
    name: "MRPL_PID_C101_Distillation.png",
    type: "Plant Drawing",
    size: "4.8 MB",
    uploaded: "Today at 07:15 PM",
    status: "Diagram Analyzed",
    category: "Atmospheric Distillation Unit",
  },
  {
    name: "approval_note_L2041.docx",
    type: "Official Note (Word)",
    size: "48 KB",
    uploaded: "Today at 08:20 PM",
    status: "Ready for Sign-off",
    category: "Safety Compliance",
  },
  {
    name: "calculation_sheet_L2041.xlsx",
    type: "Math Sheet (Excel)",
    size: "26 KB",
    uploaded: "Today at 08:20 PM",
    status: "Verified Formulas",
    category: "Arithmetic Safety Check",
  },
  {
    name: "orifice_calc.py",
    type: "Calculation Program",
    size: "8.4 KB",
    uploaded: "Today at 07:40 PM",
    status: "Passed All 6 Checks",
    category: "Flow Rate Formula",
  },
]

export default function DocumentsPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
            <FileText className="size-5 text-primary" />
            <span>Documents &amp; Files</span>
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Secure storage for your uploaded scans and AI-generated ready documents.
          </p>
        </div>

        <Button size="default" className="gap-2 font-bold text-xs rounded-xl shadow-sm">
          <Upload className="size-4" />
          <span>Upload Document</span>
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input
            placeholder="Search by file name or document type..."
            className="pl-9 text-sm h-10 rounded-xl"
          />
        </div>
        <Badge variant="outline" className="text-xs text-muted-foreground font-semibold px-3 py-1 rounded-lg">
          {documentList.length} Files Available
        </Badge>
      </div>

      {/* Documents Table */}
      <Card className="border-border rounded-2xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">Document Name</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Type</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Category</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Size</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
              <TableHead className="text-xs font-bold text-foreground text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documentList.map((doc) => (
              <TableRow key={doc.name} className="hover:bg-muted/30">
                <TableCell className="text-sm font-semibold text-foreground flex items-center gap-2.5 py-3.5">
                  {doc.name.endsWith(".pdf") ? (
                    <FileText className="size-4 text-blue-400" />
                  ) : doc.name.endsWith(".docx") || doc.name.endsWith(".xlsx") ? (
                    <TableIcon className="size-4 text-primary" />
                  ) : doc.name.endsWith(".png") ? (
                    <Map className="size-4 text-primary" />
                  ) : (
                    <FileCheck className="size-4 text-blue-400" />
                  )}
                  <span>{doc.name}</span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{doc.type}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{doc.category}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{doc.size}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="gap-1.5 text-xs text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold bg-blue-500/5">
                    <CheckCircle2 className="size-3.5" />
                    <span>{doc.status}</span>
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs font-semibold rounded-lg shadow-sm">
                    <Download className="size-3.5 text-primary" />
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
