"use client"

import React from "react"
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  FileText,
  UserCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useWorkbench } from "@/lib/workbench-context"
import { approvalGateConfig } from "@/lib/config"
import { cn } from "@/lib/utils"

export function ApprovalGate() {
  const { activeTask, handleApprove, handleReject, handleModify } = useWorkbench()
  const { approvalData, approvalStatus, currentState } = activeTask

  if (!approvalData) return null

  const isApproved = approvalStatus === "approved" || currentState === "COMPLETE"
  const isRejected = approvalStatus === "rejected" || currentState === "FAILED"

  return (
    <Card className={cn(
      "my-4 rounded-xl border bg-card shadow-sm overflow-hidden transition-all",
      isApproved && "border-emerald-500/30 bg-emerald-500/5",
      isRejected && "border-destructive/30 bg-destructive/5",
      !isApproved && !isRejected && "border-amber-500/30 bg-card"
    )}>
      <CardHeader className="p-4 pb-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={cn(
              "flex size-8 items-center justify-center rounded-lg border",
              isApproved && "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
              isRejected && "bg-destructive/10 text-destructive border-destructive/20",
              !isApproved && !isRejected && "bg-amber-500/10 text-amber-500 border-amber-500/20"
            )}>
              {isApproved ? (
                <CheckCircle2 className="size-4" />
              ) : isRejected ? (
                <XCircle className="size-4" />
              ) : (
                <AlertCircle className="size-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {approvalGateConfig.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                {approvalGateConfig.subtitle}
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "text-[11px] font-medium px-2.5 py-0.5 rounded-md",
              isApproved && "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
              isRejected && "border-destructive/30 bg-destructive/10 text-destructive",
              !isApproved && !isRejected && "border-amber-500/30 bg-amber-500/10 text-amber-500"
            )}
          >
            {isApproved ? "Approved" : isRejected ? "Declined" : "Action Required"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-1 space-y-3">
        {/* Recommendation Statement */}
        <div className="rounded-lg border border-border/80 bg-background/60 p-3">
          <span className="text-[11px] font-medium uppercase text-muted-foreground tracking-wider">
            Recommendation
          </span>
          <p className="mt-1 text-sm font-semibold text-foreground leading-snug">
            {approvalData.recommendation}
          </p>
          <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
            {approvalData.rationale}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-background/40 p-2.5">
            <span className="text-[11px] text-muted-foreground">Measured Thickness</span>
            <p className="mt-0.5 text-base font-bold text-destructive">{approvalData.measuredValue}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/40 p-2.5">
            <span className="text-[11px] text-muted-foreground">Safe Limit</span>
            <p className="mt-0.5 text-base font-bold text-foreground">{approvalData.thresholdValue}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/40 p-2.5">
            <span className="text-[11px] text-muted-foreground">Standard</span>
            <p className="mt-0.5 text-xs font-medium text-foreground truncate">{approvalData.standardRef}</p>
          </div>
        </div>

        {/* Prepared Deliverables list */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground pt-1">
          <span className="text-[11px]">Ready files:</span>
          {approvalData.deliverablesPending.map((doc) => (
            <span key={doc} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-secondary text-foreground text-[11px]">
              <FileText className="size-3 text-muted-foreground" />
              {doc}
            </span>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2.5 border-t border-border/60 bg-muted/30 p-3">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <UserCheck className="size-3.5" />
          <span>Signer: {approvalData.reviewerRoleRequired}</span>
        </div>

        {!isApproved && !isRejected ? (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleModify}
              className="gap-1.5 text-xs h-8 px-2.5"
            >
              <RotateCcw className="size-3.5" />
              <span>Adjust</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReject}
              className="gap-1.5 text-xs text-destructive hover:bg-destructive/10 h-8 px-2.5"
            >
              <XCircle className="size-3.5" />
              <span>Decline</span>
            </Button>
            <Button
              size="sm"
              onClick={handleApprove}
              className="gap-1.5 bg-foreground text-background hover:bg-foreground/90 text-xs font-semibold h-8 px-3.5 shadow-none"
            >
              <CheckCircle2 className="size-3.5" />
              <span>Approve &amp; Sign</span>
            </Button>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            Sign-off recorded at {new Date().toLocaleTimeString()}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
