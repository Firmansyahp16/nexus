<script lang="ts">
  import { supabase } from "../../lib/supabase";
  import type { Account } from "../../lib/types";
  import { loadAll } from "../../stores/app";

  export let account: Account | null = null;
  export let onClose: () => void;

  const isEdit = !!account;

  let form = {
    account_name: account?.account_name ?? "",
    initial_balance: account?.initial_balance ?? 0,
  };

  let saving = false;
  let error = "";

  async function save() {
    if (!form.account_name.trim()) {
      error = "Account name is required.";
      return;
    }

    saving = true;
    error = "";

    const payload = {
      account_name: form.account_name.trim(),
      initial_balance: Number(form.initial_balance) || 0,
    };

    let result;

    if (isEdit) {
      result = await supabase
        .from("accounts")
        .update(payload)
        .eq("account_id", account?.account_id);
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
          bind:value={form.account_name}
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

    <div class="modal-action mt-6">
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

  <button
    type="button"
    aria-label="Close modal"
    class="modal-backdrop"
    on:click={onClose}
  ></button>
</dialog>
