"use client"

import React from "react"
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
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
      "my-5 border-2 rounded-2xl transition-all shadow-md overflow-hidden",
      isApproved && "border-blue-500/40 bg-blue-500/5",
      isRejected && "border-destructive/40 bg-destructive/5",
      !isApproved && !isRejected && "border-amber-500/50 bg-amber-500/5"
    )}>
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex size-10 items-center justify-center rounded-xl border shadow-sm",
              isApproved && "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30",
              isRejected && "bg-destructive/20 text-destructive border-destructive/30",
              !isApproved && !isRejected && "bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 animate-pulse"
            )}>
              {isApproved ? (
                <CheckCircle2 className="size-5" />
              ) : isRejected ? (
                <XCircle className="size-5" />
              ) : (
                <AlertTriangle className="size-5" />
              )}
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {approvalGateConfig.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {approvalGateConfig.subtitle}
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className={cn(
              "text-xs font-bold px-3 py-1 rounded-full",
              isApproved && "border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400",
              isRejected && "border-destructive/40 bg-destructive/10 text-destructive",
              !isApproved && !isRejected && "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300"
            )}
          >
            {isApproved ? "Approved & Finalized" : isRejected ? "Decline Confirmed" : "Action Required"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-4">
        {/* Recommendation Statement */}
        <div className="rounded-xl border border-border bg-background p-4 shadow-sm">
          <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
            AI Finding &amp; Recommendation
          </span>
          <p className="mt-1 text-base font-bold text-foreground leading-snug">
            {approvalData.recommendation}
          </p>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            {approvalData.rationale}
          </p>
        </div>

        {/* Plain Numbers Breakdown */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background/90 p-3 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">Measured Thickness</span>
            <p className="mt-1 text-lg font-bold text-destructive">{approvalData.measuredValue}</p>
          </div>
          <div className="rounded-xl border border-border bg-background/90 p-3 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">Minimum Safe Limit</span>
            <p className="mt-1 text-lg font-bold text-foreground">{approvalData.thresholdValue}</p>
          </div>
          <div className="rounded-xl border border-border bg-background/90 p-3 shadow-sm">
            <span className="text-xs font-medium text-muted-foreground">Safety Standard</span>
            <p className="mt-1 text-sm font-semibold text-primary">{approvalData.standardRef}</p>
          </div>
        </div>

        {/* Ready Deliverables list */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Documents Prepared for Signature:</span>
          <div className="flex flex-wrap gap-2">
            {approvalData.deliverablesPending.map((doc) => (
              <Badge key={doc} variant="secondary" className="gap-1.5 py-1 px-2.5 text-xs font-medium">
                <FileText className="size-3.5 text-primary" />
                {doc}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 bg-muted/20 p-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <UserCheck className="size-4 text-primary" />
          <span>Required Signer: {approvalData.reviewerRoleRequired}</span>
        </div>

        {!isApproved && !isRejected ? (
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="default"
              onClick={handleModify}
              className="gap-2 text-xs font-semibold h-9 px-3"
            >
              <RotateCcw className="size-4" />
              <span>Ask AI to Adjust</span>
            </Button>
            <Button
              variant="destructive"
              size="default"
              onClick={handleReject}
              className="gap-2 text-xs font-semibold h-9 px-3"
            >
              <XCircle className="size-4" />
              <span>Decline</span>
            </Button>
            <Button
              size="default"
              onClick={handleApprove}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 px-4 shadow"
            >
              <CheckCircle2 className="size-4" />
              <span>Approve &amp; Sign</span>
            </Button>
          </div>
        ) : (
          <div className="text-xs font-semibold text-muted-foreground">
            Sign-off recorded at {new Date().toLocaleTimeString()}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
