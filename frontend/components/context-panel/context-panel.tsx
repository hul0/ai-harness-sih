"use client"

import React from "react"
import {
  FileText,
  BookOpen,
  Table,
  Map,
  Download,
  CheckCircle2,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  Minimize2,
  FileCheck,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWorkbench } from "@/lib/workbench-context"
import { PIDGraphViewer } from "@/components/pid/pid-graph-viewer"
import { cn } from "@/lib/utils"

export function ContextPanel() {
  const {
    activeTask,
    activeTab,
    setActiveTab,
    isContextPanelOpen,
    setIsContextPanelOpen,
    isExpandedView,
    setIsExpandedView,
  } = useWorkbench()

  if (!isContextPanelOpen) {
    return (
      <div className="flex h-full w-14 flex-col items-center border-l border-border bg-card/60 p-3 shrink-0">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsContextPanelOpen(true)}
          className="size-9 p-0 text-muted-foreground hover:text-foreground rounded-lg"
          title="Open Information & Documents Panel"
        >
          <PanelRightOpen className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-l border-border bg-card shrink-0 transition-all duration-300 shadow-sm",
        isExpandedView ? "w-full md:w-[680px]" : "w-full md:w-[440px]"
      )}
    >
      {/* Header with Tab Triggers & Collapse Controls */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4 bg-muted/20">
        <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
          Task Information &amp; Files
        </span>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpandedView(!isExpandedView)}
            className="size-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
            title={isExpandedView ? "Normal Size" : "Expand to Large View"}
          >
            {isExpandedView ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsContextPanelOpen(false)}
            className="size-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
            title="Close Panel"
          >
            <PanelRightClose className="size-4" />
          </Button>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 pt-2.5 border-b border-border bg-background/50">
          <TabsList className="grid grid-cols-4 h-10 w-full p-1 rounded-xl">
            <TabsTrigger value="artifacts" className="text-xs gap-1.5 font-semibold">
              <FileCheck className="size-3.5" />
              <span>Documents</span>
            </TabsTrigger>

            <TabsTrigger value="sources" className="text-xs gap-1.5 font-semibold">
              <BookOpen className="size-3.5" />
              <span>Safety Rules</span>
            </TabsTrigger>

            <TabsTrigger value="pid" className="text-xs gap-1.5 font-semibold">
              <Map className="size-3.5" />
              <span>Diagram</span>
            </TabsTrigger>

            <TabsTrigger value="files" className="text-xs gap-1.5 font-semibold">
              <FileText className="size-3.5" />
              <span>Uploads</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Artifacts & Deliverables */}
        <TabsContent value="artifacts" className="flex-1 p-4 m-0 overflow-y-auto space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              Ready-to-Download Files ({activeTask.artifacts.length})
            </span>
            <Badge variant="outline" className="text-xs text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold">
              Verified Ready
            </Badge>
          </div>

          <div className="space-y-3">
            {activeTask.artifacts.map((art) => (
              <Card key={art.id} className="border-border bg-background p-4 rounded-xl shadow-sm hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                      {art.fileType === "docx" ? (
                        <FileText className="size-4" />
                      ) : art.fileType === "xlsx" ? (
                        <Table className="size-4" />
                      ) : (
                        <FileCheck className="size-4" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-foreground">
                        {art.filename}
                      </h5>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {art.fileSizeFormatted} · Standard Document Format
                      </p>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="h-8 gap-1.5 text-xs font-semibold rounded-lg shadow-sm">
                    <Download className="size-3.5 text-primary" />
                    <span>Download</span>
                  </Button>
                </div>

                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                  {art.summary}
                </p>

                <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-xs text-blue-600 dark:text-blue-400 border border-blue-500/20 font-medium">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span>{art.validationMessage}</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Sources & SOP Citations */}
        <TabsContent value="sources" className="flex-1 p-4 m-0 overflow-y-auto space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              Official Safety Guidelines ({activeTask.citations.length})
            </span>
            <Badge variant="outline" className="text-xs text-primary border-primary/30 font-semibold">
              Matched Rules
            </Badge>
          </div>

          {activeTask.citations.length > 0 ? (
            <div className="space-y-3">
              {activeTask.citations.map((cit) => (
                <Card key={cit.id} className="border-border bg-background p-4 rounded-xl shadow-sm">
                  <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-2">
                    <Badge variant="secondary" className="text-xs text-primary font-bold">
                      {cit.source} · {cit.section}
                    </Badge>
                    <span className="text-xs text-muted-foreground font-medium">Page {cit.page}</span>
                  </div>

                  <h5 className="text-xs font-bold text-foreground mb-1.5">
                    {cit.title}
                  </h5>

                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-3 rounded-lg border border-border/40">
                    &ldquo;{cit.snippet}&rdquo;
                  </p>

                  <div className="mt-2.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Rule Requirement: {cit.toleranceRequired}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-muted-foreground font-medium">
              No specific company guidelines were needed for this calculation task.
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Interactive P&ID Graph Viewer */}
        <TabsContent value="pid" className="flex-1 p-4 m-0 overflow-y-auto">
          <PIDGraphViewer graphData={activeTask.pidGraph} isFullScreen={isExpandedView} />
        </TabsContent>

        {/* Tab 4: Files & Scans */}
        <TabsContent value="files" className="flex-1 p-4 m-0 overflow-y-auto space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase">
              Original Files Uploaded
            </span>
          </div>

          <Card className="border-border bg-background p-4 rounded-xl">
            <div className="flex items-center gap-3">
              <FileText className="size-6 text-primary" />
              <div>
                <h5 className="text-xs font-bold text-foreground">
                  MRPL_UT_Thickness_L2041_Scan.pdf
                </h5>
                <p className="text-xs text-muted-foreground mt-0.5">
                  2.4 MB · High-Clarity Measurement Report
                </p>
              </div>
            </div>
            <div className="mt-3 rounded-lg border border-border bg-muted/40 p-2.5 text-xs text-muted-foreground leading-relaxed">
              Scan Status: Successfully read by AI assistant. Measured pipe wall thickness: 3.8 mm at Elbow E-102.
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
