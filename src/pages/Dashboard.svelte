<script lang="ts">
  import {
    accounts,
    activePage,
    fmt,
    fmtDate,
    fmtPct,
    goals,
    totalBalance,
    totalExpense,
    totalIncome,
    transactions,
  } from "../stores/app";
</script>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
  <div class="stat bg-base-200 rounded-2xl shadow-sm p-5">
    <div
      class="font-bold stat-title text-[11px] uppercase tracking-wide text-base-content/50"
    >
      Net Worth
    </div>
    <div class="stat-value text-primary text-xl">
      {fmt($totalBalance)}
    </div>
    <div class="stat-desc text-xs text-base-content/40">
      {$accounts.length} accounts
    </div>
  </div>

  <div class="stat bg-base-200 rounded-2xl shadow-sm p-5">
    <div
      class="font-bold stat-title text-[11px] uppercase tracking-wide text-base-content/50"
    >
      Total Income
    </div>
    <div class="stat-value text-success text-xl">
      {fmt($totalIncome)}
    </div>
  </div>

  <div class="stat bg-base-200 rounded-2xl shadow-sm p-5">
    <div
      class="font-bold stat-title text-[11px] uppercase tracking-wide text-base-content/50"
    >
      Total Expense
    </div>
    <div class="stat-value text-error text-xl">
      {fmt($totalExpense)}
    </div>
  </div>

  <div class="stat bg-base-200 rounded-2xl shadow-sm p-5">
    <div
      class="font-bold stat-title text-[11px] uppercase tracking-wide text-base-content/50"
    >
      Net Flow
    </div>
    <div
      class="stat-value text-xl {$totalIncome - $totalExpense >= 0
        ? 'text-success'
        : 'text-error'}"
    >
      {fmt($totalIncome - $totalExpense)}
    </div>
  </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
  <div class="card bg-base-200 rounded-2xl shadow-sm">
    <div class="card-body p-0">
      <div
        class="flex items-center justify-between px-6 py-5 border-b border-base-300"
      >
        <h2 class="font-semibold text-sm tracking-wide">Accounts</h2>
        <button
          class="btn btn-ghost btn-xs text-base-content/60 hover:text-primary"
          on:click={() => activePage.set("accounts")}
        >
          View all →
        </button>
      </div>

      <ul class="divide-y divide-base-300">
        {#each $accounts as a}
          <li
            class="flex items-center justify-between px-6 py-4 hover:bg-base-300/40 transition"
          >
            <div class="space-y-1">
              <p class="text-sm font-bold">{a.account_name}</p>
              <p class="text-xs text-base-content/40">
                Initial: {fmt(a.initial_balance)}
              </p>
            </div>
            <span class="font-semibold text-sm text-primary">
              {fmt(a.available_balance)}
            </span>
          </li>
        {/each}
      </ul>
    </div>
  </div>

  <div class="card bg-base-200 rounded-2xl shadow-sm">
    <div class="card-body p-0">
      <div
        class="flex items-center justify-between px-6 py-5 border-b border-base-300"
      >
        <h2 class="font-semibold text-sm tracking-wide">Goals</h2>
        <button
          class="btn btn-ghost btn-xs text-base-content/60 hover:text-primary"
          on:click={() => activePage.set("goals")}
        >
          View all →
        </button>
      </div>

      <ul class="divide-y divide-base-300">
        {#each $goals as g}
          <li class="px-6 py-4 hover:bg-base-300/40 transition">
            <div class="flex justify-between items-center mb-2">
              <p class="text-sm font-bold">{g.goal_name}</p>
              <span class="text-xs font-bold text-primary">
                {fmtPct(g.progress_percent)}
              </span>
            </div>

            <progress
              class="progress progress-primary w-full h-2"
              value={Math.min((g.progress_percent ?? 0) * 100, 100)}
              max="100"
            ></progress>

            <p class="text-xs font-bold text-base-content/40 mt-2">
              {fmt(g.total_account_balance)} / {fmt(g.target)}
            </p>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</div>

<div class="card bg-base-200 rounded-2xl shadow-sm">
  <div class="card-body p-0">
    <div
      class="flex items-center justify-between px-6 py-5 border-b border-base-300"
    >
      <h2 class="font-semibold text-sm tracking-wide">Recent Transactions</h2>
      <button
        class="btn btn-ghost btn-xs text-base-content/60 hover:text-primary"
        on:click={() => activePage.set("transactions")}
      >
        View all →
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr class="text-[11px] uppercase tracking-wider text-base-content/40">
            <th>Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {#each $transactions.slice(0, 5) as t}
            <tr class="hover transition">
              <td class="text-xs whitespace-nowrap">
                {fmtDate(t.date)}
              </td>

              <td>
                <span
                  class="font-bold badge badge-sm {t.type === 'INCOME'
                    ? 'badge-success'
                    : t.type === 'EXPENSE'
                      ? 'badge-error'
                      : 'badge-info'}"
                >
                  {t.type}
                </span>
              </td>

              <td
                class="font-semibold text-sm whitespace-nowrap {t.type ===
                'INCOME'
                  ? 'text-success'
                  : t.type === 'EXPENSE'
                    ? 'text-error'
                    : t.type === 'TRANSFER'
                      ? 'text-info'
                      : ''}"
              >
                {fmt(t.amount)}
              </td>

              <td
                class="text-xs text-base-content/50 truncate max-w-45 md:max-w-none"
              >
                {t.description ?? "—"}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
