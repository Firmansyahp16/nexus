export interface Account {
  account_id: string;
  account_name: string;
  initial_balance: number;
  total_income: number;
  total_expense: number;
  available_balance: number;
}

export interface Category {
  category_id: string;
  category_name: string;
  total_income: number;
  total_expense: number;
}

export interface Goal {
  goal_id: string;
  goal_name: string;
  account_id: string;
  target: number;
  total_account_balance: number;
  progress_percent: number;
  priority: number;
  target_date: string;
  allocated: number;
}

export interface Tax {
  tax_year: number;
  bruto_income: number;
  tax_estimation: number;
  percent_of_income: number;
  minimum_savings_month: number;
}

export interface Transaction {
  transaction_id: string;
  date: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  amount: number;
  description: string;
  category_id: string;
  account_id: string;
  to_account_id: string;
  tax_reserve: number;
}

export const TYPES: Transaction["type"][] = ["INCOME", "EXPENSE", "TRANSFER"];
