"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Settlement } from "@/lib/types"
import { ArrowRight, CheckCircle, Clock, DollarSign } from "lucide-react"

interface SettlementListProps {
  settlements: Settlement[]
  onSettlementComplete: (settlementId: string, txHash: string) => void
}

export function SettlementList({ settlements, onSettlementComplete }: SettlementListProps) {
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null)

  const pendingSettlements = settlements.filter((s) => s.status === "pending")
  const completedSettlements = settlements.filter((s) => s.status === "completed")

  const handleSettlementComplete = (txHash: string) => {
    if (selectedSettlement) {
      onSettlementComplete(selectedSettlement.id, txHash)
      setSelectedSettlement(null)
    }
  }

  if (settlements.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">All Settled Up!</h3>
          <p className="text-muted-foreground">No pending settlements in this group.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Pending Settlements */}
      {pendingSettlements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Pending Settlements ({pendingSettlements.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingSettlements.map((settlement) => (
              <div
                key={settlement.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">You owe</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {settlement.to?.slice(0, 6)}...{settlement.to?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-right">
                    <p className="font-semibold text-lg">${settlement.amount}</p>
                    <p className="text-sm text-muted-foreground">USDC</p>
                  </div>
                </div>
                <Button onClick={() => setSelectedSettlement(settlement)} size="sm" className="ml-4">
                  Settle
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Completed Settlements */}
      {completedSettlements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Completed Settlements ({completedSettlements.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedSettlements.map((settlement) => (
              <div
                key={settlement.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-green-50 dark:bg-green-950/20"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Paid to</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {settlement.to?.slice(0, 6)}...{settlement.to?.slice(-4)}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-right">
                    <p className="font-semibold text-lg">${settlement.amount}</p>
                    <p className="text-sm text-muted-foreground">USDC</p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                >
                  Completed
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
