"use client"

import React, { createContext, useContext, useState, useMemo, useCallback } from "react"
import { TaskState, SovereigntyMetrics, PIDNode } from "@/types/workbench"
import {
  mockScenariosMap,
  scenario1_Inspection,
  defaultSovereigntyMetrics,
} from "@/lib/mock-data"

interface WorkbenchContextType {
  activeTask: TaskState
  scenarioKey: string
  setScenario: (key: 'inspection_report' | 'sandbox_repair' | 'sovereignty_proof' | 'pid_analysis') => void
  sovereignty: SovereigntyMetrics
  selectedNode: PIDNode | null
  setSelectedNode: (node: PIDNode | null) => void
  activeTab: string
  setActiveTab: (tab: string) => void
  isContextPanelOpen: boolean
  setIsContextPanelOpen: (open: boolean) => void
  isExpandedView: boolean
  setIsExpandedView: (expanded: boolean) => void
  handleApprove: () => void
  handleReject: () => void
  handleModify: () => void
  triggerSimulatedEgress: () => void
}

const WorkbenchContext = createContext<WorkbenchContextType | undefined>(undefined)

export function WorkbenchProvider({ children }: { children: React.ReactNode }) {
  const [scenarioKey, setScenarioKeyState] = useState<'inspection_report' | 'sandbox_repair' | 'sovereignty_proof' | 'pid_analysis'>('inspection_report')
  const [tasksState, setTasksState] = useState<Record<string, TaskState>>(mockScenariosMap)
  const [sovereignty, setSovereignty] = useState<SovereigntyMetrics>(defaultSovereigntyMetrics)
  const [selectedNode, setSelectedNode] = useState<PIDNode | null>(null)
  const [activeTab, setActiveTab] = useState<string>("artifacts")
  const [isContextPanelOpen, setIsContextPanelOpen] = useState<boolean>(true)
  const [isExpandedView, setIsExpandedView] = useState<boolean>(false)

  const activeTask = useMemo(() => {
    return tasksState[scenarioKey] || scenario1_Inspection
  }, [tasksState, scenarioKey])

  const setScenario = useCallback((key: 'inspection_report' | 'sandbox_repair' | 'sovereignty_proof' | 'pid_analysis') => {
    setScenarioKeyState(key)
    if (key === 'pid_analysis') {
      setActiveTab("pid")
    } else if (key === 'inspection_report') {
      setActiveTab("artifacts")
    } else if (key === 'sandbox_repair') {
      setActiveTab("artifacts")
    } else {
      setActiveTab("sources")
    }
  }, [])

  const handleApprove = useCallback(() => {
    setTasksState((prev) => {
      const current = prev[scenarioKey]
      if (!current) return prev
      return {
        ...prev,
        [scenarioKey]: {
          ...current,
          currentState: "COMPLETE",
          approvalStatus: "approved",
          steps: [
            ...current.steps,
            {
              stepId: `step-approval-${Date.now()}`,
              state: "COMPLETE",
              title: "Human Sign-off Confirmed & Deliverables Published",
              description: "Senior Inspection Engineer approved recommendation. DOCX & XLSX published to MRPL secure registry.",
              durationMs: 40,
              status: "passed",
              timestamp: new Date().toLocaleTimeString(),
            },
          ],
        },
      }
    })
  }, [scenarioKey])

  const handleReject = useCallback(() => {
    setTasksState((prev) => {
      const current = prev[scenarioKey]
      if (!current) return prev
      return {
        ...prev,
        [scenarioKey]: {
          ...current,
          currentState: "FAILED",
          approvalStatus: "rejected",
          steps: [
            ...current.steps,
            {
              stepId: `step-rejected-${Date.now()}`,
              state: "FAILED",
              title: "Human Review: Recommendation Overruled/Rejected",
              description: "Reviewer rejected recommendation and requested secondary physical NDT ultrasonic re-calibration.",
              durationMs: 30,
              status: "failed",
              timestamp: new Date().toLocaleTimeString(),
            },
          ],
        },
      }
    })
  }, [scenarioKey])

  const handleModify = useCallback(() => {
    setTasksState((prev) => {
      const current = prev[scenarioKey]
      if (!current) return prev
      return {
        ...prev,
        [scenarioKey]: {
          ...current,
          currentState: "REPAIR",
          steps: [
            ...current.steps,
            {
              stepId: `step-modify-${Date.now()}`,
              state: "REPAIR",
              title: "Re-analysis Requested by Reviewer",
              description: "Agent re-evaluating tolerance parameters with modified corrosion allowance factor (+0.5mm safety margin).",
              durationMs: 120,
              status: "repaired",
              timestamp: new Date().toLocaleTimeString(),
            },
          ],
        },
      }
    })
  }, [scenarioKey])

  const triggerSimulatedEgress = useCallback(() => {
    setSovereignty((prev) => ({
      ...prev,
      localRequests: prev.localRequests + 1,
      lastBlockedPacket: {
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19) + " UTC",
        destination: "api.anthropic.com:443 (160.79.104.10)",
        protocol: "TCP/TLSv1.3",
        process: "sandbox_container_runner",
        reason: "Container Network Policy: --network=none active. Blocked by kernel netfilter.",
      },
    }))
  }, [])

  return (
    <WorkbenchContext.Provider
      value={{
        activeTask,
        scenarioKey,
        setScenario,
        sovereignty,
        selectedNode,
        setSelectedNode,
        activeTab,
        setActiveTab,
        isContextPanelOpen,
        setIsContextPanelOpen,
        isExpandedView,
        setIsExpandedView,
        handleApprove,
        handleReject,
        handleModify,
        triggerSimulatedEgress,
      }}
    >
      {children}
    </WorkbenchContext.Provider>
  )
}

export function useWorkbench() {
  const context = useContext(WorkbenchContext)
  if (!context) {
    throw new Error("useWorkbench must be used within a WorkbenchProvider")
  }
  return context
}
