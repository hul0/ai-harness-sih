"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessageSquareText,
  FileText,
  BookOpen,
  Map,
  Sliders,
  History,
  Plus,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWorkbench } from "@/lib/workbench-context"
import { project } from "@/lib/config"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    label: "Workspace",
    icon: MessageSquareText,
  },
  {
    href: "/documents",
    label: "Documents",
    icon: FileText,
  },
  {
    href: "/knowledge",
    label: "Guidelines",
    icon: BookOpen,
  },
  {
    href: "/pid-viewer",
    label: "Diagrams",
    icon: Map,
  },
  {
    href: "/models",
    label: "Models",
    icon: Sliders,
  },
  {
    href: "/audit",
    label: "Audit Log",
    icon: History,
  },
]

const demoScenarios = [
  {
    key: "inspection_report" as const,
    title: "Pipe Thickness Inspection",
    subtitle: "Ultrasonic scan check against SOP",
    icon: FileText,
  },
  {
    key: "sandbox_repair" as const,
    title: "Engineering Calculation",
    subtitle: "Flow formula with error check",
    icon: Sliders,
  },
  {
    key: "sovereignty_proof" as const,
    title: "Privacy Verification",
    subtitle: "Egress firewall proof test",
    icon: Sliders,
  },
  {
    key: "pid_analysis" as const,
    title: "Diagram Analysis",
    subtitle: "Equipment & flow tracing",
    icon: Map,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { scenarioKey, setScenario } = useWorkbench()

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar shrink-0 text-sidebar-foreground select-none">
      {/* Top Action: New Chat / Task */}
      <div className="p-3 border-b border-border/60">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setScenario("inspection_report")}
          className="w-full justify-between h-9 px-3 rounded-lg border-border/80 bg-background/80 hover:bg-muted font-medium text-xs text-foreground shadow-none"
        >
          <span className="flex items-center gap-2">
            <Plus className="size-4 text-muted-foreground" />
            <span>New Task</span>
          </span>
          <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded border border-border">Ctrl+N</span>
        </Button>
      </div>

      {/* Demo Scenario Quick Switcher */}
      <div className="p-3 border-b border-border/60">
        <div className="mb-2 px-1 text-[11px] font-medium text-muted-foreground">
          Sample Scenarios
        </div>

        <div className="flex flex-col gap-1">
          {demoScenarios.map((sc) => {
            const isSelected = scenarioKey === sc.key
            return (
              <button
                key={sc.key}
                onClick={() => setScenario(sc.key)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-colors",
                  isSelected
                    ? "bg-secondary text-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <span className="truncate">{sc.title}</span>
                {isSelected && <Check className="size-3.5 text-emerald-500 shrink-0 ml-1.5" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation Routes */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-2 px-1 text-[11px] font-medium text-muted-foreground">
          Navigation
        </div>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-2.5 text-xs h-8 px-2.5 rounded-lg shadow-none",
                    isActive
                      ? "font-semibold text-foreground bg-secondary"
                      : "text-muted-foreground hover:text-foreground font-normal"
                  )}
                >
                  <Icon className={cn("size-4", isActive ? "text-foreground" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Minimal Status Footer */}
      <div className="p-3 border-t border-border/60 text-xs text-muted-foreground">
        <div className="flex items-center justify-between px-1 py-0.5">
          <span className="text-[11px] font-medium text-muted-foreground">{project.name} {project.version}</span>
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Local
          </span>
        </div>
      </div>
    </aside>
  )
}
