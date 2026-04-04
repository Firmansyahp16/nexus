<script lang="ts">
  import { supabase } from "../../lib/supabase";
  import type { Category } from "../../lib/types";
  import { loadAll } from "../../stores/app";

  export let category: Category | null = null;
  export let onClose: () => void;

  const isEdit = !!category;

  let form = {
    category_name: category?.category_name ?? "",
  };

  let saving = false;
  let error = "";

  async function save() {
    if (!form.category_name.trim()) {
      error = "Category name is required.";
      return;
    }

    saving = true;
    error = "";

    const payload = {
      category_name: form.category_name.trim(),
    };

    let result;

    if (isEdit) {
      result = await supabase
        .from("categories")
        .update(payload)
        .eq("category_id", category?.category_id);
    } else {
      result = await supabase.from("categories").insert(payload);
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
        {isEdit ? "Edit Category" : "Add Category"}
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
            Category Name
          </span>
        </div>
        <input
          class="input input-bordered input-sm"
          type="text"
          bind:value={form.category_name}
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
        {saving ? "Saving..." : isEdit ? "Update Category" : "Save Category"}
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
