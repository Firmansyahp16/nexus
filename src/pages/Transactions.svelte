<script lang="ts">
  import ModalTransaction from "../components/modals/ModalTransaction.svelte";
  import { editTrigger } from "../lib/editTrigger";
  import type { TransactionType, TransactionView } from "../lib/types";
  import { fmt, fmtDate, transactions } from "../stores/app";

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

  let editing: TransactionView | null = null;
</script>

<div class="flex flex-col gap-4 lg:hidden">
  {#each $transactions as t}
    <div
      class="card bg-base-200 rounded-2xl shadow-sm relative group
         border border-base-300/60
         transition-all duration-200
         hover:shadow-md hover:-translate-y-px"
      role="button"
      tabindex="0"
      use:editTrigger
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
         opacity-0 group-hover:opacity-100
         transition-all duration-200
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
            <p class="text-xs text-base-content/40">
              {fmtDate(t.date)}
            </p>
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
            <span class="text-base-content/30 italic"> No description </span>
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

  {#if $transactions.length === 0}
    <div class="py-20 text-center text-base-content/30 text-sm">
      No transactions yet.
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
          {#each $transactions as t}
            <tr
              class="hover:bg-base-300/40 transition-colors duration-150 cursor-pointer"
              role="button"
              tabindex="0"
              onclick={() => (editing = t)}
              onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  editing = t;
                }
              }}
            >
              <td class="text-xs whitespace-nowrap px-6">
                {fmtDate(t.date)}
              </td>

              <td>
                <span
                  class="badge badge-sm {badgeClass(t.type as TransactionType)}"
                >
                  {t.type}
                </span>
              </td>

              <td
                class="font-semibold text-sm whitespace-nowrap tracking-tight {amountClass(
                  t.type as TransactionType,
                )}"
              >
                {amountPrefix(t.type as TransactionType)}{fmt(t.amount ?? 0)}
              </td>

              <td class="text-xs text-base-content/50 max-w-65 truncate">
                {t.description ?? "—"}
              </td>

              <td class="text-xs text-base-content/40 text-right pr-6">
                {t.tax_reserve > 0 ? fmt(t.tax_reserve) : "—"}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if $transactions.length === 0}
      <div class="py-20 text-center text-base-content/30 text-sm">
        No transactions yet.
      </div>
    {/if}
  </div>
</div>

{#if editing}
  <ModalTransaction transaction={editing} onClose={() => (editing = null)} />
{/if}
