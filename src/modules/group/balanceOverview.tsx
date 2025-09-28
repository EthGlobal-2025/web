"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Receipt,
} from "lucide-react";
import type { DetailedBalance, Expense, Group } from "@/lib/types";

interface BalanceOverviewProps {
  group: Group;
  userAddress: string;
}

export function BalanceOverview({ group, userAddress }: BalanceOverviewProps) {
  const expenses: Expense = {
    id: "",
    groupId: "",
    amount: 0,
    description: "",
    paidBy: "",
    participants: [],
    createdAt: new Date(),
  };

  const detailedBalance: DetailedBalance = {
    breakdown: [],
    settlements: [],
    totalGroupExpenses: 0,
    isBalanced: false,
  };

  const userBreakdown = detailedBalance.breakdown.find(
    (b) => b.memberAddress === userAddress
  );

  const userHistory: any = {};

  const formatAddress = (address: string) => {
    return address === userAddress
      ? "You"
      : `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getBalanceColor = (balance: number) => {
    if (balance > 0.01) return "text-green-600";
    if (balance < -0.01) return "text-red-600";
    return "text-muted-foreground";
  };

  const getBalanceIcon = (balance: number) => {
    if (balance > 0.01)
      return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (balance < -0.01)
      return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <DollarSign className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Your Balance
              </span>
            </div>
            <p
              className={`text-2xl font-bold ${getBalanceColor(
                userBreakdown?.netBalance || 0
              )}`}
            >
              {userBreakdown?.netBalance && userBreakdown.netBalance > 0
                ? "+"
                : ""}
              ${(userBreakdown?.netBalance || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">You Paid</span>
            </div>
            <p className="text-2xl font-bold">
              ${(userBreakdown?.totalPaid || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Your Share</span>
            </div>
            <p className="text-2xl font-bold">
              ${(userBreakdown?.totalOwed || 0).toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
            <p className="text-2xl font-bold">
              {userBreakdown?.expenseCount || 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="balances" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="balances">Member Balances</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
          <TabsTrigger value="breakdown">Detailed Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Member Balances</span>
                {detailedBalance.isBalanced && (
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    Balanced
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Current balance status for all group members
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {detailedBalance.breakdown
                .sort((a, b) => b.netBalance - a.netBalance)
                .map((member) => (
                  <div
                    key={member.memberAddress}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {member.memberAddress.slice(2, 4).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {formatAddress(member.memberAddress)}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Paid: ${member.totalPaid.toFixed(2)}</span>
                          <span>Share: ${member.totalOwed.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getBalanceIcon(member.netBalance)}
                      <div className="text-right">
                        <p
                          className={`font-semibold ${getBalanceColor(
                            member.netBalance
                          )}`}
                        >
                          {member.netBalance > 0 ? "+" : ""}$
                          {member.netBalance.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {member.netBalance > 0.01
                            ? "Gets back"
                            : member.netBalance < -0.01
                            ? "Owes"
                            : "Settled"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settlements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recommended Settlements</CardTitle>
              <CardDescription>
                Optimal payments to settle all balances with minimum
                transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {detailedBalance.settlements.length === 0 ? (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All Settled!</h3>
                  <p className="text-muted-foreground">
                    No settlements needed. All balances are settled.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {detailedBalance.settlements.map((settlement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {settlement.from.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {formatAddress(settlement.from)}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                        <div className="flex items-center space-x-2">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="text-xs">
                              {settlement.to.slice(2, 4).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">
                            {formatAddress(settlement.to)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-lg font-bold">
                          ${settlement.amount.toFixed(2)}
                        </span>
                        {(settlement.from === userAddress ||
                          settlement.to === userAddress) && (
                          <Button size="sm">
                            {settlement.from === userAddress
                              ? "Pay Now"
                              : "Request"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>{detailedBalance.settlements.length}</strong>{" "}
                      settlement
                      {detailedBalance.settlements.length !== 1 ? "s" : ""}{" "}
                      needed to balance all accounts.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Your Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
                <CardDescription>
                  Your expense history in this group
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Expenses you paid
                    </span>
                    <span className="font-semibold">
                      {userHistory.paidExpenses.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Expenses you're in
                    </span>
                    <span className="font-semibold">
                      {userHistory.participatedExpenses.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total you paid
                    </span>
                    <span className="font-semibold">
                      ${userHistory.totalPaid.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Your total share
                    </span>
                    <span className="font-semibold">
                      ${userHistory.totalOwed.toFixed(2)}
                    </span>
                  </div>
                </div>

                {userHistory.totalOwed > 0 && (
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Payment ratio</span>
                      <span>
                        {(
                          (userHistory.totalPaid / userHistory.totalOwed) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <Progress
                      value={
                        (userHistory.totalPaid / userHistory.totalOwed) * 100
                      }
                      className="h-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Group Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Group Statistics</CardTitle>
                <CardDescription>
                  Overall group expense statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total expenses
                    </span>
                    <span className="font-semibold">
                      ${detailedBalance.totalGroupExpenses.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Average per person
                    </span>
                    <span className="font-semibold">
                      $
                      {(
                        detailedBalance.totalGroupExpenses /
                        group.members.length
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Number of expenses
                    </span>
                    <span className="font-semibold">{expenses?.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Settlements needed
                    </span>
                    <span className="font-semibold">
                      {detailedBalance.settlements.length}
                    </span>
                  </div>
                </div>

                {detailedBalance.isBalanced && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                      ✓ All balances are settled!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
