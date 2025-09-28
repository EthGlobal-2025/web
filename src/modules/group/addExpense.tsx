"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { X, DollarSign, Users, Receipt, Calculator } from "lucide-react";
import type { Group } from "@/lib/types";

interface AddExpenseProps {
  group: Group;
  userAddress: string;
  onClose: () => void;
}

const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Accommodation",
  "Entertainment",
  "Shopping",
  "Utilities",
  "Other",
];

export function AddExpense({ group, userAddress, onClose }: AddExpenseProps) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [paidBy, setPaidBy] = useState(userAddress);
  const [participants, setParticipants] = useState<string[]>([userAddress]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [splitType, setSplitType] = useState<"equal" | "custom">("equal");

  const handleParticipantToggle = (memberAddress: string) => {
    if (participants.includes(memberAddress)) {
      setParticipants(participants.filter((p) => p !== memberAddress));
    } else {
      setParticipants([...participants, memberAddress]);
    }
  };

  const handleSubmit = async () => {
    if (!amount || !description || participants.length === 0) return;

    setIsSubmitting(true);

    try {
      console.log({
        groupId: group.id,
        amount: Number.parseFloat(amount),
        description: description.trim(),
        paidBy,
        participants,
        category: category || undefined,
      });

      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Failed to add expense:", error);
      setIsSubmitting(false);
    }
  };

  const splitAmount =
    participants.length > 0
      ? Number.parseFloat(amount || "0") / participants.length
      : 0;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Receipt className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Add Expense</CardTitle>
                <CardDescription>
                  Add a new expense to {group.name}
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Expense Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="What was this expense for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Who Paid */}
          <div className="space-y-3">
            <Label>Who paid?</Label>
            <div className="grid grid-cols-1 gap-2">
              {group.members.map((member) => (
                <div
                  key={member.address}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    paidBy === member.address
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/50"
                  }`}
                  onClick={() => setPaidBy(member.address)}
                >
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      paidBy === member.address
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    }`}
                  />
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {member.address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">
                      {member.address === userAddress
                        ? "You"
                        : `${member.address.slice(
                            0,
                            6
                          )}...${member.address.slice(-4)}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Split Between */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Split between</Label>
              <Badge variant="outline" className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>
                  {participants.length} member
                  {participants.length !== 1 ? "s" : ""}
                </span>
              </Badge>
            </div>

            <div className="space-y-2">
              {group.members.map((member) => (
                <div
                  key={member.address}
                  className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    checked={participants.includes(member.address)}
                    onCheckedChange={() =>
                      handleParticipantToggle(member.address)
                    }
                  />
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs">
                      {member.address.slice(2, 4).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">
                      {member.address === userAddress
                        ? "You"
                        : `${member.address.slice(
                            0,
                            6
                          )}...${member.address.slice(-4)}`}
                    </p>
                  </div>
                  {participants.includes(member.address) && (
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ${splitAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        per person
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          {amount && participants.length > 0 && (
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Calculator className="w-4 h-4 text-primary" />
                  <span className="font-medium">Split Summary</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total amount:</span>
                    <span className="font-medium">
                      ${Number.parseFloat(amount || "0").toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Split {participants.length} ways:</span>
                    <span className="font-medium">
                      ${splitAmount.toFixed(2)} each
                    </span>
                  </div>
                  <div className="flex justify-between text-primary">
                    <span>Paid by:</span>
                    <span className="font-medium">
                      {paidBy === userAddress
                        ? "You"
                        : `${paidBy.slice(0, 6)}...${paidBy.slice(-4)}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                !amount ||
                !description ||
                participants.length === 0 ||
                isSubmitting
              }
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                  Adding...
                </>
              ) : (
                <>
                  <Receipt className="w-4 h-4 mr-2" />
                  Add Expense
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
