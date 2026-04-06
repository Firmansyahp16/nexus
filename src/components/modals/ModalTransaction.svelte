<script lang="ts">
  import { supabase } from "../../lib/supabase";
  import {
    TRANSACTION_TYPES,
    type TransactionInput,
    type TransactionView,
  } from "../../lib/types";
  import { accounts, categories, loadAll } from "../../stores/app";

  export let transaction: TransactionView | null = null;
  export let onClose: () => void;

  const isEdit = !!transaction;

  function toLocalDT(iso?: string) {
    if (!iso) return new Date().toISOString().slice(0, 16);
    const d = new Date(iso);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
  }

  let form: TransactionInput = {
    date: toLocalDT(transaction?.date),
    type: transaction?.type || "INCOME",
    amount: transaction?.amount || null,
    description: transaction?.description || null,
    category_id: transaction?.category_id || null,
    account_id: transaction?.account_id || null,
    to_account_id: transaction?.to_account_id || null,
  };

  let saving = false;
  let error = "";

  async function save() {
    if (!form.date) {
      error = "Date is required.";
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      error = "Amount must be greater than 0.";
      return;
    }

    if (!form.account_id) {
      error = "Account is required.";
      return;
    }

    if (form.type === "TRANSFER" && form.account_id === form.to_account_id) {
      error = "Source and destination account must differ.";
      return;
    }

    saving = true;
    error = "";

    const payload: TransactionInput = {
      date: form.date,
      type: form.type || null,
      amount: Number(form.amount) || null,
      description: form.description || null,
      account_id: form.account_id || null,
      category_id: form.type !== "TRANSFER" ? form.category_id || null : null,
      to_account_id:
        form.type === "TRANSFER" ? form.to_account_id || null : null,
    };

    let result;

    if (isEdit) {
      result = await supabase
        .from("transactions")
        .update(payload)
        .eq("id", transaction?.id || null);
    } else {
      result = await supabase.from("transactions").insert(payload);
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
      .from("transactions")
      .delete()
      .eq("id", transaction?.id);

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
  <div class="modal-box w-full max-w-lg p-6 sm:p-8 space-y-6">
    <div class="flex items-start justify-between">
      <div>
        <h3 class="text-xl font-semibold tracking-tight">
          {isEdit ? "Edit Transaction" : "New Transaction"}
        </h3>
        <p class="text-xs text-base-content/50 mt-1">
          {isEdit ? "Update transaction details" : "Create a new record"}
        </p>
      </div>

      <button
        class="btn btn-ghost btn-sm btn-circle"
        type="button"
        on:click={onClose}
      >
        ✕
      </button>
    </div>

    <div class="bg-base-200 rounded-xl p-1 flex">
      {#each TRANSACTION_TYPES as t}
        <button
          type="button"
          class="flex-1 text-xs font-medium py-2 rounded-lg transition
            {form.type === t
            ? t === 'INCOME'
              ? 'bg-success text-success-content'
              : t === 'EXPENSE'
                ? 'bg-error text-error-content'
                : 'bg-info text-info-content'
            : 'text-base-content/60 hover:bg-base-300'}"
          on:click={() => (form.type = t)}
        >
          {t}
        </button>
      {/each}
    </div>

    <div class="space-y-4">
      <div class="grid sm:grid-cols-2 gap-4">
        <label class="form-control">
          <div class="label pb-1">
            <span
              class="label-text text-xs uppercase tracking-wider text-base-content/50"
            >
              Date
            </span>
          </div>
          <input
            class="input input-bordered w-full"
            type="datetime-local"
            bind:value={form.date}
          />
        </label>

        <label class="form-control">
          <div class="label pb-1">
            <span
              class="label-text text-xs uppercase tracking-wider text-base-content/50"
            >
              Amount
            </span>
          </div>
          <input
            class="input input-bordered w-full"
            type="number"
            min="0"
            bind:value={form.amount}
          />
        </label>
      </div>

      <div class="grid sm:grid-cols-2 gap-4">
        <label class="form-control">
          <div class="label pb-1">
            <span
              class="label-text text-xs uppercase tracking-wider text-base-content/50"
            >
              {form.type === "TRANSFER" ? "From Account" : "Account"}
            </span>
          </div>
          <select
            class="select select-bordered w-full"
            bind:value={form.account_id}
          >
            <option value="">Select account</option>
            {#each $accounts as a}
              <option value={a.id}>{a.name}</option>
            {/each}
          </select>
        </label>

        {#if form.type === "TRANSFER"}
          <label class="form-control">
            <div class="label pb-1">
              <span
                class="label-text text-xs uppercase tracking-wider text-base-content/50"
              >
                To Account
              </span>
            </div>
            <select
              class="select select-bordered w-full"
              bind:value={form.to_account_id}
            >
              <option value="">Select account</option>
              {#each $accounts as a}
                <option value={a.id}>{a.name}</option>
              {/each}
            </select>
          </label>
        {:else}
          <label class="form-control">
            <div class="label pb-1">
              <span
                class="label-text text-xs uppercase tracking-wider text-base-content/50"
              >
                Category
              </span>
            </div>
            <select
              class="select select-bordered w-full"
              bind:value={form.category_id}
            >
              <option value="">Select category</option>
              {#each $categories as c}
                <option value={c.id}>{c.name}</option>
              {/each}
            </select>
          </label>
        {/if}
      </div>

      <label class="form-control">
        <div class="label pb-1">
          <span
            class="label-text text-xs uppercase tracking-wider text-base-content/50"
          >
            Description
          </span>
        </div>
        <input
          class="input input-bordered w-full"
          type="text"
          placeholder="Optional note"
          bind:value={form.description}
        />
      </label>

      {#if error}
        <div class="text-error text-sm bg-error/10 px-3 py-2 rounded-lg">
          {error}
        </div>
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
          {saving
            ? "Saving..."
            : isEdit
              ? "Update Transaction"
              : "Save Transaction"}
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
