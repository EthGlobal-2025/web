"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, Users, Receipt, Plus, DollarSign } from "lucide-react";
import { AddExpense } from "./addExpense";
import { ExpenseList } from "./expenseList";
import { BalanceOverview } from "./balanceOverview";
import { SettlementList } from "./settlementList";
import { TransactionHistory } from "./transactionHistory";
import { Group } from "@/lib/types";

interface GroupDetailsProps {
  groupId: string;
  userAddress: string;
  onClose: () => void;
}

export function GroupDetails({
  groupId,
  userAddress,
  onClose,
}: GroupDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddExpense, setShowAddExpense] = useState(false);

  const group: Group = {
    id: "",
    name: "",
    members: [],
    totalExpenses: 0,
    createdAt: new Date(),
    createdBy: "",
    status: "active",
  };
  const expenses: any[] = [];
  const settlements: any[] = [];

  if (!group) {
    return null;
  }

  const isOwner = group.createdBy === userAddress;
  const userMember = group.members.find((m) => m.address === userAddress);
  const userBalance = userMember?.balance || 0;

  const handleCreateSettlements = () => {};

  const handleSettlementComplete = (settlementId: string, txHash: string) => {
    console.log({ settlementId, txHash });
  };

  console.log({ group, userAddress });

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl flex items-center space-x-2">
                    <span>{group?.name}</span>
                    {isOwner && <Badge variant="outline">Owner</Badge>}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-4 mt-1">
                    <span>{group?.members.length} members</span>
                    <span>•</span>
                    <span>
                      ${group.totalExpenses.toFixed(2)} total expenses
                    </span>
                    <span>•</span>
                    <span>
                      Created {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                  </CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            {group.description && (
              <p className="text-muted-foreground mt-2">{group.description}</p>
            )}
          </CardHeader>

          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="balances">Balances</TabsTrigger>
                <TabsTrigger value="settlements">Settlements</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="expenses">Expenses</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Balance Summary */}
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Your Balance
                        </span>
                      </div>
                      <p
                        className={`text-2xl font-bold ${
                          userBalance > 0
                            ? "text-green-600"
                            : userBalance < 0
                            ? "text-red-600"
                            : "text-muted-foreground"
                        }`}
                      >
                        {userBalance > 0 ? "+" : ""}${userBalance.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Receipt className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Total Expenses
                        </span>
                      </div>
                      <p className="text-2xl font-bold">
                        ${group.totalExpenses.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Members
                        </span>
                      </div>
                      <p className="text-2xl font-bold">
                        {group.members.length}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                      <Button size="sm" onClick={() => setShowAddExpense(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Expense
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {expenses.length === 0 ? (
                      <div className="text-center py-8">
                        <Receipt className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-4">
                          No expenses yet. Add your first expense to get
                          started!
                        </p>
                        <Button onClick={() => setShowAddExpense(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Expense
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {expenses.slice(0, 5).map((expense) => (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="font-medium">
                                {expense.description}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Paid by{" "}
                                {expense.paidBy === userAddress
                                  ? "You"
                                  : `${expense.paidBy.slice(
                                      0,
                                      6
                                    )}...${expense.paidBy.slice(-4)}`}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                ${expense.amount.toFixed(2)}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(
                                  expense.createdAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                        {expenses.length > 5 && (
                          <Button
                            variant="ghost"
                            className="w-full"
                            onClick={() => setActiveTab("expenses")}
                          >
                            View all {expenses.length} expenses
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="balances">
                <BalanceOverview group={group} userAddress={userAddress} />
              </TabsContent>

              <TabsContent value="settlements" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Settlements</h3>
                  <Button size="sm" onClick={handleCreateSettlements}>
                    <Plus className="w-4 h-4 mr-2" />
                    Generate Settlements
                  </Button>
                </div>

                <SettlementList
                  settlements={settlements}
                  onSettlementComplete={handleSettlementComplete}
                />
              </TabsContent>

              <TabsContent value="history">
                <TransactionHistory
                  expenses={expenses}
                  settlements={settlements}
                  groupName={group.name}
                  userAddress={userAddress}
                />
              </TabsContent>

              <TabsContent value="members" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Group Members</h3>
                  {isOwner && (
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {group.members.map((member) => (
                    <Card key={member.address}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>
                                {member.address.slice(2, 4).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                {member.address === userAddress
                                  ? "You"
                                  : `${member.address.slice(
                                      0,
                                      6
                                    )}...${member.address.slice(-4)}`}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Joined{" "}
                                {new Date(member.joinedAt).toLocaleDateString()}
                              </p>
                            </div>
                            {member.address === group.createdBy && (
                              <Badge variant="outline">Owner</Badge>
                            )}
                          </div>
                          <div className="text-right">
                            <p
                              className={`font-semibold ${
                                member.balance > 0
                                  ? "text-green-600"
                                  : member.balance < 0
                                  ? "text-red-600"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {member.balance > 0 ? "+" : ""}$
                              {member.balance.toFixed(2)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {member.balance > 0
                                ? "Gets back"
                                : member.balance < 0
                                ? "Owes"
                                : "Settled"}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="expenses" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">All Expenses</h3>
                  <Button size="sm" onClick={() => setShowAddExpense(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Expense
                  </Button>
                </div>

                <ExpenseList group={group} userAddress={userAddress} />
              </TabsContent>

              <TabsContent value="settings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Group Settings</CardTitle>
                    <CardDescription>
                      Manage your group preferences and settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Group Status</p>
                        <p className="text-sm text-muted-foreground">
                          Current status of the group
                        </p>
                      </div>
                      <Badge
                        variant={
                          group.status === "active" ? "default" : "secondary"
                        }
                      >
                        {group.status}
                      </Badge>
                    </div>

                    {isOwner && (
                      <div className="space-y-3 pt-4 border-t">
                        <p className="font-medium text-destructive">
                          Danger Zone
                        </p>
                        <Button variant="destructive" size="sm">
                          Delete Group
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <AddExpense
          group={group}
          userAddress={userAddress}
          onClose={() => setShowAddExpense(false)}
        />
      )}
    </>
  );
}
