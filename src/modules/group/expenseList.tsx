"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Receipt,
  Calendar,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  DollarSign,
} from "lucide-react";
import type { Expense, Group } from "@/lib/types";

interface ExpenseListProps {
  group: Group;
  userAddress: string;
}

export function ExpenseList({ group, userAddress }: ExpenseListProps) {
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);

  const expenses: Expense[] = [];

  const handleDeleteExpense = (expenseId: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      console.log({ expenseId });
    }
  };

  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      "Food & Dining": "bg-orange-100 text-orange-800 border-orange-200",
      Transportation: "bg-blue-100 text-blue-800 border-blue-200",
      Accommodation: "bg-purple-100 text-purple-800 border-purple-200",
      Entertainment: "bg-pink-100 text-pink-800 border-pink-200",
      Shopping: "bg-green-100 text-green-800 border-green-200",
      Utilities: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Other: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[category || "Other"] || colors["Other"];
  };

  if (expenses.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Receipt className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No expenses yet</h3>
          <p className="text-muted-foreground text-center mb-6 max-w-sm">
            Start adding expenses to track what everyone owes in this group.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => {
        const splitAmount = expense.amount / expense.participants.length;
        const isUserPayer = expense.paidBy === userAddress;
        const isUserParticipant = expense.participants.includes(userAddress);

        return (
          <Card key={expense.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Receipt className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {expense.description}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(expense.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>
                            {expense.participants.length} participant
                            {expense.participants.length !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {expense.category && (
                    <Badge
                      variant="outline"
                      className={`mb-3 ${getCategoryColor(expense.category)}`}
                    >
                      {expense.category}
                    </Badge>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Paid By */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Paid by
                      </p>
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {expense.paidBy.slice(2, 4).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {expense.paidBy === userAddress
                            ? "You"
                            : `${expense.paidBy.slice(
                                0,
                                6
                              )}...${expense.paidBy.slice(-4)}`}
                        </span>
                        {isUserPayer && (
                          <Badge variant="secondary" className="text-xs">
                            You paid
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Split Details */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">
                        Your share
                      </p>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {isUserParticipant
                            ? `$${splitAmount.toFixed(2)}`
                            : "Not included"}
                        </span>
                        {isUserParticipant && !isUserPayer && (
                          <Badge
                            variant="outline"
                            className="text-xs text-red-600 border-red-200"
                          >
                            You owe
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Participants */}
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground mb-2">
                      Split between
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {expense.participants.map((participantAddress) => (
                        <div
                          key={participantAddress}
                          className="flex items-center space-x-1 bg-muted/50 rounded-full px-2 py-1"
                        >
                          <Avatar className="w-4 h-4">
                            <AvatarFallback className="text-xs">
                              {participantAddress.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs">
                            {participantAddress === userAddress
                              ? "You"
                              : `${participantAddress.slice(0, 4)}...`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      ${expense.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${splitAmount.toFixed(2)} each
                    </p>
                  </div>

                  {(isUserPayer || group.createdBy === userAddress) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteExpense(expense.id)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
