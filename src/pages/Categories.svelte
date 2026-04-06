<script lang="ts">
  import ModalCategory from "../components/modals/ModalCategory.svelte";
  import { editTrigger } from "../lib/editTrigger";
  import type { CategoryView } from "../lib/types";
  import { categories, fmt } from "../stores/app";

  let editing: CategoryView | null = null;
</script>

<div class="card bg-base-200 rounded-2xl shadow-sm">
  <div class="card-body p-0">
    <div class="overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr class="text-[11px] uppercase tracking-wider text-base-content/40">
            <th class="px-6">Category</th>
            <th class="text-right">Total Income</th>
            <th class="text-right pr-6">Total Expense</th>
          </tr>
        </thead>

        <tbody>
          {#each $categories as c}
            <tr
              class="hover:bg-base-300/40 transition-colors duration-150 cursor-pointer"
              use:editTrigger
              onclick={() => (editing = c)}
              onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  editing = c;
                }
              }}
            >
              <td class="font-bold px-6 py-4">
                {c.name}
              </td>

              <td class="text-success font-bold text-right whitespace-nowrap">
                {fmt(c.total_income)}
              </td>

              <td
                class="text-error font-bold text-right pr-6 whitespace-nowrap"
              >
                {fmt(c.total_expense)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if $categories.length === 0}
      <div class="py-20 text-center text-base-content/30 text-sm">
        No categories yet.
      </div>
    {/if}
  </div>
</div>

{#if editing}
  <ModalCategory category={editing} onClose={() => (editing = null)} />
{/if}
