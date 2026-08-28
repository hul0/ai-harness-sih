"use client"

import React from "react"
import {
  FileText,
  BookOpen,
  Table,
  Map,
  Download,
  Check,
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
      <div className="flex h-full w-12 flex-col items-center border-l border-border bg-card/60 p-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsContextPanelOpen(true)}
          className="size-8 p-0 text-muted-foreground hover:text-foreground rounded-lg"
          title="Open Context Panel"
        >
          <PanelRightOpen className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-l border-border bg-card shrink-0 transition-all duration-200",
        isExpandedView ? "w-full md:w-[640px]" : "w-full md:w-[400px]"
      )}
    >
      {/* Header with Tab Controls */}
      <div className="flex h-12 items-center justify-between border-b border-border/80 px-4 bg-muted/20">
        <span className="text-xs font-medium text-muted-foreground">
          Context &amp; Files
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpandedView(!isExpandedView)}
            className="size-7 p-0 text-muted-foreground hover:text-foreground rounded-md"
            title={isExpandedView ? "Normal view" : "Expand view"}
          >
            {isExpandedView ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsContextPanelOpen(false)}
            className="size-7 p-0 text-muted-foreground hover:text-foreground rounded-md"
            title="Close panel"
          >
            <PanelRightClose className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 pt-2 pb-1.5 border-b border-border/60 bg-background/40">
          <TabsList className="grid grid-cols-4 h-8 w-full p-0.5 rounded-lg bg-muted/60">
            <TabsTrigger value="artifacts" className="text-xs gap-1 font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none">
              <FileCheck className="size-3" />
              <span>Docs</span>
            </TabsTrigger>

            <TabsTrigger value="sources" className="text-xs gap-1 font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none">
              <BookOpen className="size-3" />
              <span>SOPs</span>
            </TabsTrigger>

            <TabsTrigger value="pid" className="text-xs gap-1 font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none">
              <Map className="size-3" />
              <span>P&amp;ID</span>
            </TabsTrigger>

            <TabsTrigger value="files" className="text-xs gap-1 font-medium data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-none">
              <FileText className="size-3" />
              <span>Files</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Artifacts & Deliverables */}
        <TabsContent value="artifacts" className="flex-1 p-3.5 m-0 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Generated Documents ({activeTask.artifacts.length})</span>
          </div>

          <div className="space-y-2.5">
            {activeTask.artifacts.map((art) => (
              <Card key={art.id} className="border-border/80 bg-background/80 p-3.5 rounded-xl shadow-none hover:border-border transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-foreground mt-0.5">
                      {art.fileType === "docx" ? (
                        <FileText className="size-3.5" />
                      ) : art.fileType === "xlsx" ? (
                        <Table className="size-3.5" />
                      ) : (
                        <FileCheck className="size-3.5" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-foreground truncate">
                        {art.filename}
                      </h5>
                      <p className="text-[11px] text-muted-foreground">
                        {art.fileSizeFormatted}
                      </p>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="h-7 gap-1 text-xs px-2.5 rounded-md">
                    <Download className="size-3 text-muted-foreground" />
                    <span>Get</span>
                  </Button>
                </div>

                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {art.summary}
                </p>

                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Check className="size-3 text-emerald-500 shrink-0" />
                  <span>{art.validationMessage}</span>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 2: Sources & SOP Citations */}
        <TabsContent value="sources" className="flex-1 p-3.5 m-0 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Matched Guidelines ({activeTask.citations.length})</span>
          </div>

          {activeTask.citations.length > 0 ? (
            <div className="space-y-2.5">
              {activeTask.citations.map((cit) => (
                <Card key={cit.id} className="border-border/80 bg-background/80 p-3.5 rounded-xl shadow-none">
                  <div className="flex items-center justify-between border-b border-border/40 pb-1.5 mb-1.5">
                    <span className="text-xs font-semibold text-foreground">
                      {cit.source} · {cit.section}
                    </span>
                    <span className="text-[11px] text-muted-foreground">Page {cit.page}</span>
                  </div>

                  <h5 className="text-xs font-medium text-foreground mb-1">
                    {cit.title}
                  </h5>

                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 p-2 rounded-lg border border-border/30">
                    &ldquo;{cit.snippet}&rdquo;
                  </p>

                  <div className="mt-2 text-[11px] text-foreground font-medium">
                    {cit.toleranceRequired}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-xs text-muted-foreground">
              No specific guidelines required for this task.
            </div>
          )}
        </TabsContent>

        {/* Tab 3: Interactive P&ID Graph Viewer */}
        <TabsContent value="pid" className="flex-1 p-3.5 m-0 overflow-y-auto">
          <PIDGraphViewer graphData={activeTask.pidGraph} isFullScreen={isExpandedView} />
        </TabsContent>

        {/* Tab 4: Files & Scans */}
        <TabsContent value="files" className="flex-1 p-3.5 m-0 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Uploaded Files</span>
          </div>

          <Card className="border-border/80 bg-background/80 p-3.5 rounded-xl shadow-none">
            <div className="flex items-center gap-2.5">
              <FileText className="size-5 text-muted-foreground" />
              <div>
                <h5 className="text-xs font-semibold text-foreground">
                  MRPL_UT_Thickness_L2041_Scan.pdf
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  2.4 MB · Ultrasonic Inspection Report
                </p>
              </div>
            </div>
            <div className="mt-2.5 rounded-lg bg-muted/30 p-2 text-xs text-muted-foreground leading-relaxed">
              Read 2 pages. Key measurement: 3.8 mm at Elbow E-102.
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
