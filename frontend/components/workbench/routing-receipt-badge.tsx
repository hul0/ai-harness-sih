"use client"

import React from "react"
import {
  Sparkles,
  CheckCircle2,
} from "lucide-react"
import { RoutingReceipt } from "@/types/workbench"

interface RoutingReceiptBadgeProps {
  routing: RoutingReceipt
}

export function RoutingReceiptBadge({ routing }: RoutingReceiptBadgeProps) {
  return (
    <div className="my-2.5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs">
      <div className="flex items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Sparkles className="size-3.5" />
        </div>
        <div>
          <span className="font-semibold text-foreground">
            Selected Assistant: {routing.modelName}
          </span>
          <span className="text-muted-foreground ml-2">
            ({routing.reason})
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 text-xs text-blue-600 dark:text-blue-400 font-medium">
        <CheckCircle2 className="size-3.5" />
        <span>Ready &amp; Active</span>
      </div>
    </div>
  )
}
