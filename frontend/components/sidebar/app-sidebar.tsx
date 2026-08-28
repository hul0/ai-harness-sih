"use client"

import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MessageSquareText,
  FileText,
  BookOpen,
  Map,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  History,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useWorkbench } from "@/lib/workbench-context"
import { project } from "@/lib/config"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/",
    label: "AI Workspace",
    icon: MessageSquareText,
  },
  {
    href: "/documents",
    label: "Documents & Files",
    icon: FileText,
  },
  {
    href: "/knowledge",
    label: "Company Guidelines (SOPs)",
    icon: BookOpen,
  },
  {
    href: "/pid-viewer",
    label: "Plant Diagrams",
    icon: Map,
  },
  {
    href: "/models",
    label: "AI Assistant Info",
    icon: Sliders,
  },
  {
    href: "/audit",
    label: "Activity History",
    icon: History,
  },
]

const demoScenarios = [
  {
    key: "inspection_report" as const,
    title: "1. Pipe Thickness Inspection",
    subtitle: "Check pipe scan vs safety rules",
    icon: FileText,
  },
  {
    key: "sandbox_repair" as const,
    title: "2. Engineering Calculation",
    subtitle: "Flow calculation with safety check",
    icon: Sliders,
  },
  {
    key: "sovereignty_proof" as const,
    title: "3. Privacy Verification Test",
    subtitle: "Verify zero internet leakage",
    icon: ShieldCheck,
  },
  {
    key: "pid_analysis" as const,
    title: "4. Plant Diagram Explanation",
    subtitle: "Identify valves, pumps & flow route",
    icon: Map,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { scenarioKey, setScenario } = useWorkbench()

  return (
    <aside className="flex h-full w-72 flex-col border-r border-border bg-sidebar shrink-0 text-sidebar-foreground">
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold shadow-md shadow-primary/20">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground">
              {project.name}
            </h1>
            <p className="text-xs text-muted-foreground">
              Secure Workplace Assistant
            </p>
          </div>
        </div>
      </div>

      {/* Demo Scenario Quick Switcher */}
      <div className="p-4 border-b border-border bg-muted/20">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Sample Workplace Tasks
          </span>
          <Badge variant="secondary" className="text-[11px] font-medium">4 Ready</Badge>
        </div>

        <div className="flex flex-col gap-2">
          {demoScenarios.map((sc) => {
            const isSelected = scenarioKey === sc.key
            const Icon = sc.icon
            return (
              <button
                key={sc.key}
                onClick={() => setScenario(sc.key)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-all border",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground shadow-sm ring-1 ring-primary/30"
                    : "border-transparent bg-background/60 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <div className={cn("mt-0.5 shrink-0 rounded-lg p-1.5", isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs truncate">{sc.title}</span>
                    {isSelected && <CheckCircle2 className="size-3.5 text-primary shrink-0" />}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{sc.subtitle}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Navigation Routes */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-2 px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Main Sections
          </span>
        </div>
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "w-full justify-start gap-3 text-sm h-10 px-3 rounded-lg",
                    isActive && "font-semibold text-foreground bg-secondary border border-border"
                  )}
                >
                  <Icon className={cn("size-4", isActive ? "text-primary" : "text-muted-foreground")} />
                  <span>{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Trust & Privacy Notice Footer in Blue Theme */}
      <div className="p-4 border-t border-border bg-card/60">
        <Card className="border-blue-500/25 bg-blue-500/5 p-3 shadow-none">
          <div className="flex items-center gap-2 mb-1 text-blue-600 dark:text-blue-400 font-semibold text-xs">
            <ShieldCheck className="size-4 shrink-0" />
            <span>100% Private Environment</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            All AI processing runs locally inside your organization. No cloud servers are contacted.
          </p>
        </Card>
      </div>
    </aside>
  )
}
