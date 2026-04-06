<script lang="ts">
  import { supabase } from "../../lib/supabase";
  import type { GoalInput, GoalView } from "../../lib/types";
  import { loadAll } from "../../stores/app";

  export let goal: GoalView | null = null;
  export let onClose: () => void;

  const isEdit = !!goal;

  let form: GoalInput = {
    name: goal?.name || null,
    target: goal?.target || null,
    priority: goal?.priority || null,
    target_date: goal?.target_date || null,
    account_id: goal?.account_id || null,
  };

  let saving = false;
  let error = "";

  async function save() {
    if (!form.name?.trim()) {
      error = "Goal name is required.";
      return;
    }

    if (!form.target || form.target <= 0) {
      error = "Target amount must be greater than 0.";
      return;
    }

    if (!form.target_date) {
      error = "Target date is required.";
      return;
    }

    if (!form.account_id) {
      error = "Account is required.";
      return;
    }

    saving = true;
    error = "";

    const payload: GoalInput = {
      name: form.name.trim() || null,
      target: Number(form.target) || null,
      priority: Number(form.priority) || null,
      target_date: form.target_date || null,
      account_id: form.account_id || null,
    };

    let result;

    if (isEdit) {
      result = await supabase.from("goals").update(payload).eq("id", goal?.id);
    } else {
      result = await supabase.from("goals").insert(payload);
    }

    saving = false;

    if (result.error) {
      error = result.error.message;
      return;
    }

    await loadAll();
    onClose?.();
  }

  async function remove() {
    if (!isEdit) return;

    saving = true;
    error = "";

    const result = await supabase.from("goals").delete().eq("id", goal?.id);

    saving = false;

    if (result.error) {
      error = result.error.message;
      return;
    }

    await loadAll();
    onClose?.();
  }
</script>

<dialog class="modal modal-open backdrop-blur-sm">
  <div class="modal-box max-w-md">
    <div class="flex items-center justify-between mb-5">
      <h3 class="font-bold text-lg">
        {isEdit ? "Edit Goal" : "Add Goal"}
      </h3>

      <button
        type="button"
        class="btn btn-ghost btn-sm btn-circle"
        on:click={onClose}
      >
        ✕
      </button>
    </div>

    <div class="flex flex-col gap-4">
      <label class="form-control">
        <div class="label">
          <span class="label-text text-xs uppercase tracking-wider">
            Goal Name
          </span>
        </div>
        <input
          class="input input-bordered input-sm"
          type="text"
          bind:value={form.name}
        />
      </label>

      <label class="form-control">
        <div class="label">
          <span class="label-text text-xs uppercase tracking-wider">
            Target Amount
          </span>
        </div>
        <input
          class="input input-bordered input-sm"
          type="number"
          min="0"
          bind:value={form.target}
        />
      </label>

      <label class="form-control">
        <div class="label">
          <span class="label-text text-xs uppercase tracking-wider">
            Target Date
          </span>
        </div>
        <input
          class="input input-bordered input-sm"
          type="date"
          bind:value={form.target_date}
        />
      </label>

      <label class="form-control">
        <div class="label">
          <span class="label-text text-xs uppercase tracking-wider">
            Priority
          </span>
        </div>
        <input
          class="input input-bordered input-sm"
          type="number"
          min="1"
          bind:value={form.priority}
        />
      </label>

      {#if error}
        <p class="text-error text-xs">{error}</p>
      {/if}
    </div>

    <div class="modal-action mt-6 justify-between">
      {#if isEdit}
        <button
          class="btn btn-error btn-outline"
          class:loading={saving}
          type="button"
          on:click={remove}
        >
          Delete
        </button>
      {/if}

      <div class="flex gap-2">
        <button class="btn btn-ghost" type="button" on:click={onClose}>
          Cancel
        </button>

        <button
          class="btn btn-primary"
          class:loading={saving}
          type="button"
          on:click={save}
        >
          {saving ? "Saving..." : isEdit ? "Update Goal" : "Save Goal"}
        </button>
      </div>
    </div>
  </div>

  <button
    type="button"
    aria-label="Close modal"
    class="modal-backdrop"
    on:click={onClose}
  ></button>
</dialog>
