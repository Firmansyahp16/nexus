<script lang="ts">
  import { supabase } from "../../lib/supabase";
  import type { AccountInput, AccountView } from "../../lib/types";
  import { loadAll } from "../../stores/app";

  export let account: AccountView | null = null;
  export let onClose: () => void;

  $: isEdit = !!account;

  let form: AccountInput = {
    name: account?.name || null,
    initial_balance: account?.initial_balance || null,
  };

  let saving = false;
  let error = "";

  async function save() {
    if (!form.name?.trim()) {
      error = "Account name is required.";
      return;
    }

    saving = true;
    error = "";

    const payload: AccountInput = {
      name: form.name.trim() || null,
      initial_balance: Number(form.initial_balance) || null,
    };

    let result;

    if (isEdit) {
      result = await supabase
        .from("accounts")
        .update(payload)
        .eq("id", account?.id);
    } else {
      result = await supabase.from("accounts").insert(payload);
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
    if (!isEdit) {
      return;
    }

    saving = true;
    error = "";

    const result = await supabase
      .from("accounts")
      .delete()
      .eq("id", account?.id);

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
        {isEdit ? "Edit Account" : "Add Account"}
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
            Account Name
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
            Initial Balance
          </span>
        </div>
        <input
          class="input input-bordered input-sm"
          type="number"
          bind:value={form.initial_balance}
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
          {saving ? "Saving..." : isEdit ? "Update Account" : "Save Account"}
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
