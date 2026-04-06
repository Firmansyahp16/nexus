export interface AccountEntity {
  id: string;
  name: string | null;
  initial_balance: number | null;
}

export interface AccountInput {
  name?: string | null;
  initial_balance?: number | null;
}

export interface AccountView extends AccountEntity {
  total_income: number;
  total_expense: number;
  available_balance: number;
}

export interface CategoryEntity {
  id: string;
  name: string;
}

export interface CategoryInput {
  name: string;
}

export interface CategoryView extends CategoryEntity {
  total_income: number;
  total_expense: number;
}

export interface GoalEntity {
  id: string;
  name: string | null;
  target: number | null;
  account_id: string | null;
  priority: number | null;
  target_date: string | null;
}

export interface GoalInput {
  name?: string | null;
  target?: number | null;
  account_id?: string | null;
  priority?: number | null;
  target_date?: string | null;
}

export interface GoalView extends GoalEntity {
  total_account_balance: number;
  allocated: number;
  progress_percent: number;
}

export interface TaxView {
  tax_year: number;
  bruto_income: number;
  tax_estimation: number;
  percent_of_income: number;
  minimum_savings_month: number;
}

export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface TransactionEntity {
  id: string;
  date: string;
  type: TransactionType | null;
  amount: number | null;
  description: string | null;
  category_id: string | null;
  account_id: string | null;
  to_account_id: string | null;
}

export interface TransactionInput {
  date: string;
  type?: TransactionType | null;
  amount?: number | null;
  description?: string | null;
  category_id?: string | null;
  account_id?: string | null;
  to_account_id?: string | null;
}

export interface TransactionView extends TransactionEntity {
  tax_reserve: number;
}

export const TRANSACTION_TYPES: TransactionType[] = [
  "INCOME",
  "EXPENSE",
  "TRANSFER",
];
