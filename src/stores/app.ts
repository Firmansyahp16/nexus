import { derived, writable } from "svelte/store";
import { supabase } from "../lib/supabase";
import type {
  AccountView,
  CategoryView,
  GoalView,
  TaxView,
  TransactionView,
} from "../lib/types";

export type Page =
  | "dashboard"
  | "transactions"
  | "accounts"
  | "categories"
  | "goals"
  | "taxes";

export type ModalType = "transaction" | "account" | "category" | "goal";

export type ModalPage = Extract<
  Page,
  "transactions" | "accounts" | "categories" | "goals"
>;

export const activePage = writable<Page>("dashboard");
export const sidebarOpen = writable(false);
export const modalType = writable<ModalType | null>(null);

export const accounts = writable<AccountView[]>([]);
export const categories = writable<CategoryView[]>([]);
export const goals = writable<GoalView[]>([]);
export const taxes = writable<TaxView[]>([]);
export const transactions = writable<TransactionView[]>([]);
export const loading = writable(true);

export const totalBalance = derived(accounts, ($a) =>
  $a.reduce((s, a) => s + (a.available_balance ?? 0), 0),
);

export const totalIncome = derived(accounts, ($a) =>
  $a.reduce((s, a) => s + (a.total_income ?? 0), 0),
);

export const totalExpense = derived(accounts, ($a) =>
  $a.reduce((s, a) => s + (a.total_expense ?? 0), 0),
);

export const MODAL_PAGES: readonly ModalPage[] = [
  "transactions",
  "accounts",
  "categories",
  "goals",
];

export function isModalPage(page: Page): page is ModalPage {
  return MODAL_PAGES.includes(page as ModalPage);
}

export async function loadAll() {
  loading.set(true);

  const [acc, cat, g, t, tr] = await Promise.all([
    supabase.rpc("get_account_balances"),
    supabase.rpc("get_category_totals"),
    supabase.rpc("get_goal_progress"),
    supabase.rpc("get_taxes_per_year"),
    supabase.rpc("get_transactions_with_tax_reserve"),
  ]);

  accounts.set(acc.data ?? []);
  categories.set(cat.data ?? []);
  goals.set(g.data ?? []);
  taxes.set(t.data ?? []);
  transactions.set(tr.data ?? []);

  loading.set(false);
}

export function fmt(n: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);
}

export function fmtPct(n: number) {
  return ((n ?? 0) * 100).toFixed(1) + "%";
}

export function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
