<script lang="ts">
  import ModalGoal from "../components/modals/ModalGoal.svelte";
  import { editTrigger } from "../lib/editTrigger";
  import type { Goal } from "../lib/types";
  import { fmt, fmtPct, goals } from "../stores/app";

  let editing: Goal | null = null;
</script>

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {#each $goals as g}
    <div
      class="card bg-base-200 rounded-2xl shadow-sm hover:shadow-md transition"
      role="button"
      tabindex="0"
      use:editTrigger
      onclick={() => (editing = g)}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          editing = g;
        }
      }}
    >
      <button
        class="absolute top-3 right-3 btn btn-ghost btn-xs btn-circle
               opacity-0 group-hover:opacity-100 transition-opacity z-10"
        onclick={(e) => {
          e.stopPropagation();
          editing = g;
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
      <div class="card-body p-6 gap-5">
        <div class="flex items-start justify-between gap-3">
          <div class="flex items-center gap-4">
            <div
              class="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0"
            >
              <svg
                class="w-5 h-5 text-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.8"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>

            <div class="flex flex-col">
              <h3 class="font-semibold text-base leading-tight">
                {g.goal_name}
              </h3>
              <span class="text-xs text-base-content/40"> Financial Goal </span>
            </div>
          </div>

          {#if g.priority}
            <span class="badge badge-neutral badge-sm shrink-0">
              P{g.priority}
            </span>
          {/if}
        </div>

        <div class="space-y-2">
          <div class="flex justify-between items-center text-xs">
            <span class="text-base-content/50">Progress</span>
            <span class="font-semibold text-secondary">
              {fmtPct(g.progress_percent)}
            </span>
          </div>

          <progress
            class="progress progress-secondary w-full h-2"
            value={Math.min((g.progress_percent ?? 0) * 100, 100)}
            max="100"
          ></progress>
        </div>

        <div class="space-y-2 text-sm pt-2 border-t border-base-300">
          <div class="flex justify-between text-base-content/60">
            <span>Allocated</span>
            <span>{fmt(g.allocated)}</span>
          </div>

          <div class="flex justify-between font-semibold text-base">
            <span>Target</span>
            <span class="text-secondary">
              {fmt(g.target)}
            </span>
          </div>
        </div>
      </div>
    </div>
  {/each}

  {#if $goals.length === 0}
    <div class="col-span-full py-20 text-center text-base-content/30 text-sm">
      No goals yet.
    </div>
  {/if}
</div>

{#if editing}
  <ModalGoal goal={editing} onClose={() => (editing = null)} />
{/if}
