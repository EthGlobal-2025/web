export interface Group {
  id: string
  name: string
  description?: string
  members: GroupMember[]
  totalExpenses: number
  createdAt: Date
  createdBy: string
  status: "active" | "settled" | "archived"
}

export interface GroupMember {
  address: string
  name?: string
  joinedAt: Date
  balance: number // positive = owed to them, negative = they owe
}

export interface Expense {
  id: string
  groupId: string
  amount: number
  description: string
  paidBy: string
  participants: string[]
  createdAt: Date
  category?: string
}

export interface BalanceBreakdown {
  memberAddress: string
  totalPaid: number
  totalOwed: number
  netBalance: number
  expenseCount: number
}

export interface Settlement {
  id: string
  from: string
  to: string
  amount: number
  status: "pending" | "completed"
  txHash?: string
  createdAt: Date
  completedAt?: Date
}

export interface DetailedBalance {
  breakdown: BalanceBreakdown[]
  settlements: Settlement[]
  totalGroupExpenses: number
  isBalanced: boolean
}
