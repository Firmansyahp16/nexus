<script lang="ts">
  import ModalAccount from "../components/modals/ModalAccount.svelte";
  import { editTrigger } from "../lib/editTrigger";
  import type { Account } from "../lib/types";
  import { accounts, fmt } from "../stores/app";

  let editing: Account | null = null;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each $accounts as a}
    <div
      class="card bg-base-200 rounded-2xl shadow-sm hover:shadow-md transition group relative"
      role="button"
      tabindex="0"
      use:editTrigger
      onclick={() => (editing = a)}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          editing = a;
        }
      }}
    >
      <button
        class="absolute top-3 right-3 btn btn-ghost btn-xs btn-circle
               opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onclick={(e) => {
          e.stopPropagation();
          editing = a;
        }}
        title="Edit"
      >
        ✎
      </button>

      <div class="card-body p-6 gap-5">
        <div class="flex items-center gap-4">
          <div
            class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0"
          >
            <svg
              class="w-5 h-5 text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.8"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>

          <div>
            <h3 class="font-bold text-base">{a.account_name}</h3>
          </div>
        </div>

        <div class="space-y-3 text-sm">
          <div class="flex justify-between text-base-content/60">
            <span class="font-bold">Initial</span>
            <span class="font-bold">{fmt(a.initial_balance)}</span>
          </div>

          <div class="flex justify-between">
            <span class="text-base-content/60 font-bold">Income</span>
            <span class="text-success font-bold">
              +{fmt(a.total_income)}
            </span>
          </div>

          <div class="flex justify-between">
            <span class="text-base-content/60 font-bold">Expense</span>
            <span class="text-error font-bold">
              -{fmt(a.total_expense)}
            </span>
          </div>

          <div
            class="pt-3 border-t border-base-300 flex justify-between font-bold text-base"
          >
            <span>Available</span>
            <span class="text-primary">
              {fmt(a.available_balance)}
            </span>
          </div>
        </div>
      </div>
    </div>
  {/each}

  {#if $accounts.length === 0}
    <div class="col-span-full py-20 text-center text-base-content/30 text-sm">
      No accounts yet.
    </div>
  {/if}
</div>

{#if editing}
  <ModalAccount account={editing} onClose={() => (editing = null)} />
{/if}
