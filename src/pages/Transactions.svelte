<script lang="ts">
  import ModalTransaction from "../components/modals/ModalTransaction.svelte";
  import { editTrigger } from "../lib/editTrigger";
  import type { TransactionType, TransactionView } from "../lib/types";
  import {
    accounts,
    categories,
    fmt,
    fmtDate,
    transactions,
  } from "../stores/app";

  // --- Filter state ---
  let filterOpen = false;
  let search = "";
  let dateFrom: string | null = null;
  let dateTo: string | null = null;
  let filterType: TransactionType | null = null;
  let filterAccount: string | null = null;
  let filterCategory: string | null = null;

  // --- Active filter count for badge ---
  $: activeFilters = [
    search,
    dateFrom,
    dateTo,
    filterType,
    filterAccount,
    filterCategory,
  ].filter(Boolean).length;

  function normalize(v: string) {
    return v === "" ? null : v;
  }

  function clearFilters() {
    filterType = null;
    filterAccount = null;
    filterCategory = null;
    dateFrom = null;
    dateTo = null;
    search = "";
  }

  // --- Filtered transactions ---
  $: filtered = $transactions.filter((t) => {
    if (search && !t.description?.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (dateFrom && new Date(t.date) < new Date(dateFrom)) return false;
    if (dateTo && new Date(t.date) > new Date(dateTo + "T23:59:59"))
      return false;
    if (filterType && t.type !== filterType) return false;
    if (filterAccount && t.account_id !== filterAccount) return false;
    if (filterCategory && t.category_id !== filterCategory) return false;
    return true;
  });

  // --- Edit ---
  let editing: TransactionView | null = null;

  function badgeClass(type: TransactionType) {
    if (type === "INCOME") return "badge-success";
    if (type === "EXPENSE") return "badge-error";
    return "badge-info";
  }
  function amountClass(type: TransactionType) {
    if (type === "INCOME") return "text-success";
    if (type === "EXPENSE") return "text-error";
    return "text-info";
  }
  function amountPrefix(type: TransactionType) {
    if (type === "INCOME") return "+";
    if (type === "EXPENSE") return "-";
    return "";
  }
</script>

<div class="mb-4 flex flex-col gap-2">
  <div class="flex gap-2">
    <label
      class="input input-bordered flex items-center gap-2 flex-1 h-10 text-sm"
    >
      <svg
        class="w-4 h-4 text-base-content/40 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M21 21l-4.35-4.35M17 11A6 6 0 111 11a6 6 0 0116 0z"
        />
      </svg>
      <input
        type="text"
        placeholder="Search description..."
        bind:value={search}
        class="grow bg-transparent outline-none text-sm"
      />
      {#if search}
        <button
          class="btn btn-ghost btn-xs btn-circle"
          onclick={() => (search = "")}>✕</button
        >
      {/if}
    </label>

    <button
      class="btn btn-outline h-10 min-h-0 gap-1.5 px-3 relative"
      class:btn-primary={filterOpen || activeFilters > 0}
      onclick={() => (filterOpen = !filterOpen)}
    >
      <svg
        class="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
        />
      </svg>
      <span class="hidden sm:inline text-sm">Filter</span>
      {#if activeFilters > 0}
        <span class="badge badge-sm badge-primary absolute -top-1.5 -right-1.5"
          >{activeFilters}</span
        >
      {/if}
    </button>
  </div>

  {#if filterOpen}
    <div class="card bg-base-200 border border-base-300">
      <div class="card-body p-5 space-y-6">
        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <label class="space-y-1">
            <div class="text-xs uppercase tracking-wider text-base-content/50">
              From
            </div>
            <input
              type="date"
              class="input input-bordered input-sm w-full"
              bind:value={dateFrom}
              onchange={(e) => (dateFrom = normalize(e.currentTarget.value))}
            />
          </label>

          <label class="space-y-1">
            <div class="text-xs uppercase tracking-wider text-base-content/50">
              To
            </div>
            <input
              type="date"
              class="input input-bordered input-sm w-full"
              bind:value={dateTo}
              onchange={(e) => (dateTo = normalize(e.currentTarget.value))}
            />
          </label>

          <label class="space-y-1">
            <div class="text-xs uppercase tracking-wider text-base-content/50">
              Type
            </div>
            <select
              class="select select-bordered select-sm w-full"
              bind:value={filterType}
              onchange={(e) =>
                (filterType = normalize(
                  e.currentTarget.value,
                ) as TransactionType | null)}
            >
              <option value="">All Types</option>
              <option value="INCOME">Income</option>
              <option value="EXPENSE">Expense</option>
              <option value="TRANSFER">Transfer</option>
            </select>
          </label>

          <label class="space-y-1">
            <div class="text-xs uppercase tracking-wider text-base-content/50">
              Account
            </div>
            <select
              class="select select-bordered select-sm w-full"
              bind:value={filterAccount}
              onchange={(e) =>
                (filterAccount = normalize(e.currentTarget.value))}
            >
              <option value="">All Accounts</option>
              {#each $accounts as a}
                <option value={a.id}>{a.name}</option>
              {/each}
            </select>
          </label>

          <label class="space-y-1 md:col-span-2 xl:col-span-1">
            <div class="text-xs uppercase tracking-wider text-base-content/50">
              Category
            </div>
            <select
              class="select select-bordered select-sm w-full"
              bind:value={filterCategory}
              onchange={(e) =>
                (filterCategory = normalize(e.currentTarget.value))}
            >
              <option value="">All Categories</option>
              {#each $categories as c}
                <option value={c.id}>{c.name}</option>
              {/each}
            </select>
          </label>
        </div>

        <div
          class="flex items-center justify-between pt-4 border-t border-base-300"
        >
          <p class="text-xs text-base-content/50">
            {filtered.length} of {$transactions.length} transactions
          </p>

          {#if activeFilters > 0}
            <button
              class="btn btn-ghost btn-xs text-error"
              onclick={clearFilters}
            >
              Clear all filters
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}

  {#if activeFilters > 0 && !filterOpen}
    <div class="flex flex-wrap gap-1.5">
      {#if filterType}
        <span class="badge badge-outline badge-sm gap-1">
          {filterType}
          <button onclick={() => (filterType = null)}>✕</button>
        </span>
      {/if}
      {#if filterAccount}
        <span class="badge badge-outline badge-sm gap-1">
          {$accounts.find((a) => a.id === filterAccount)?.name ?? filterAccount}
          <button onclick={() => (filterAccount = "")}>✕</button>
        </span>
      {/if}
      {#if filterCategory}
        <span class="badge badge-outline badge-sm gap-1">
          {$categories.find((c) => c.id === filterCategory)?.name ??
            filterCategory}
          <button onclick={() => (filterCategory = "")}>✕</button>
        </span>
      {/if}
      {#if dateFrom || dateTo}
        <span class="badge badge-outline badge-sm gap-1">
          {dateFrom || "…"} → {dateTo || "…"}
          <button
            onclick={() => {
              dateFrom = "";
              dateTo = "";
            }}>✕</button
          >
        </span>
      {/if}
    </div>
  {/if}
</div>

<div class="flex flex-col gap-4 lg:hidden">
  {#each filtered as t}
    <div
      class="card bg-base-200 rounded-2xl shadow-sm relative group
             border border-base-300/60 transition-all duration-200
             hover:shadow-md hover:-translate-y-px"
      role="button"
      tabindex="0"
      use:editTrigger
      contenteditable="true"
      onblur={() => (editing = t)}
      onclick={() => (editing = t)}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          editing = t;
        }
      }}
    >
      <button
        class="absolute top-3 right-3 btn btn-ghost btn-xs btn-circle
               opacity-0 group-hover:opacity-100 transition-all duration-200
               bg-base-100/70 backdrop-blur"
        onclick={(e) => {
          e.stopPropagation();
          editing = t;
        }}
        title="Edit"
      >
        <svg
          class="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-1.414.586H9v-2a2 2 0 01.586-1.414z"
          />
        </svg>
      </button>

      <div class="card-body p-5 gap-5">
        <div class="flex items-start justify-between">
          <div class="space-y-1">
            <span
              class="badge badge-sm font-bold {badgeClass(
                t.type as TransactionType,
              )}"
            >
              {t.type}
            </span>
            <p class="text-xs text-base-content/40">{fmtDate(t.date)}</p>
          </div>
          <span
            class="font-semibold text-lg {amountClass(
              t.type as TransactionType,
            )}"
          >
            {amountPrefix(t.type as TransactionType)}{fmt(t.amount ?? 0)}
          </span>
        </div>

        <p class="text-sm leading-snug">
          {#if t.description}
            {t.description}
          {:else}
            <span class="text-base-content/30 italic">No description</span>
          {/if}
        </p>

        {#if t.tax_reserve > 0}
          <div
            class="flex items-center gap-2 text-xs text-base-content/50 pt-1 border-t border-base-300"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Tax Reserve: {fmt(t.tax_reserve)}
          </div>
        {/if}
      </div>
    </div>
  {/each}

  {#if filtered.length === 0}
    <div class="py-20 text-center text-base-content/30 text-sm">
      {activeFilters > 0
        ? "No transactions match your filters."
        : "No transactions yet."}
    </div>
  {/if}
</div>

<div class="card bg-base-200 rounded-2xl shadow-sm hidden lg:block">
  <div class="card-body p-0">
    <div class="overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr class="text-[11px] uppercase tracking-wider text-base-content/40">
            <th class="px-6">Date</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Description</th>
            <th class="text-right pr-6">Tax Reserve</th>
          </tr>
        </thead>
        <tbody>
          {#each filtered as t}
            <tr
              class="hover:bg-base-300/40 transition-colors duration-150 cursor-pointer"
              role="button"
              tabindex="0"
              use:editTrigger
              contenteditable="true"
              onblur={() => (editing = t)}
              onclick={() => (editing = t)}
              onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  editing = t;
                }
              }}
            >
              <td class="text-xs whitespace-nowrap px-6">{fmtDate(t.date)}</td>
              <td>
                <span
                  class="badge badge-sm {badgeClass(t.type as TransactionType)}"
                  >{t.type}</span
                >
              </td>
              <td
                class="font-semibold text-sm whitespace-nowrap tracking-tight {amountClass(
                  t.type as TransactionType,
                )}"
              >
                {amountPrefix(t.type as TransactionType)}{fmt(t.amount ?? 0)}
              </td>
              <td class="text-xs text-base-content/50 max-w-65 truncate"
                >{t.description ?? "—"}</td
              >
              <td class="text-xs text-base-content/40 text-right pr-6">
                {t.tax_reserve > 0 ? fmt(t.tax_reserve) : "—"}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if filtered.length === 0}
      <div class="py-20 text-center text-base-content/30 text-sm">
        {activeFilters > 0
          ? "No transactions match your filters."
          : "No transactions yet."}
      </div>
    {/if}
  </div>
</div>

{#if editing}
  <ModalTransaction transaction={editing} onClose={() => (editing = null)} />
{/if}
