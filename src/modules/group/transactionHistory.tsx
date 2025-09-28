"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Filter,
  Receipt,
  ArrowUpDown,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";
import { Expense, Settlement } from "@/lib/types";

interface TransactionHistoryProps {
  expenses: Expense[];
  settlements: Settlement[];
  groupName: string;
  userAddress: string;
}

type TransactionType = "all" | "expenses" | "settlements";
type TransactionStatus = "all" | "completed" | "pending";

export function TransactionHistory({
  expenses,
  settlements,
  groupName,
  userAddress,
}: TransactionHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType>("all");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus>("all");
  const [selectedSettlement, setSelectedSettlement] =
    useState<Settlement | null>(null);

  // Combine and sort transactions
  const allTransactions = [
    ...expenses.map((expense) => ({
      id: expense.id,
      type: "expense" as const,
      amount: expense.amount,
      description: expense.description,
      date: expense.createdAt,
      status: "completed" as const,
      from: expense.paidBy,
      to: expense.participants,
      data: expense,
    })),
    ...settlements.map((settlement) => ({
      id: settlement.id,
      type: "settlement" as const,
      amount: settlement.amount,
      description: `Settlement payment`,
      date: settlement.createdAt,
      status: settlement.status,
      from: settlement.from,
      to: [settlement.to],
      data: settlement,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Apply filters
  const filteredTransactions = allTransactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "expenses" && transaction.type === "expense") ||
      (typeFilter === "settlements" && transaction.type === "settlement");

    const matchesStatus =
      statusFilter === "all" || transaction.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTransactionIcon = (type: string, status: string) => {
    if (type === "expense")
      return <Receipt className="w-4 h-4 text-blue-500" />;
    if (status === "completed")
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Clock className="w-4 h-4 text-orange-500" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === "completed")
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          Completed
        </Badge>
      );
    if (status === "pending")
      return (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
        >
          Pending
        </Badge>
      );
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ArrowUpDown className="w-5 h-5" />
              Transaction History
            </CardTitle>
            <Badge variant="outline">
              {filteredTransactions.length} transactions
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={typeFilter}
              onValueChange={(value: TransactionType) => setTypeFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expenses">Expenses</SelectItem>
                <SelectItem value="settlements">Settlements</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={statusFilter}
              onValueChange={(value: TransactionStatus) =>
                setStatusFilter(value)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No transactions found matching your filters.
                </p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type, transaction.status)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{transaction.type}</span>
                        {transaction.type === "expense" && (
                          <>
                            <span>•</span>
                            <span>
                              {transaction.from === userAddress
                                ? "You paid"
                                : "Paid by others"}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-semibold flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {transaction.amount.toFixed(2)}
                      </p>
                      {getStatusBadge(transaction.status)}
                    </div>

                    {transaction.type === "settlement" &&
                      transaction.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setSelectedSettlement(
                              transaction.data as Settlement
                            )
                          }
                        >
                          Receipt
                        </Button>
                      )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
