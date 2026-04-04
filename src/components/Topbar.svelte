<script lang="ts">
  import { activePage, modalType, sidebarOpen } from "../stores/app";

  type Page =
    | "dashboard"
    | "transactions"
    | "accounts"
    | "categories"
    | "goals"
    | "taxes";

  type AddablePage = "transactions" | "accounts" | "categories" | "goals";

  const pageTitles: Record<Page, string> = {
    dashboard: "Dashboard",
    transactions: "Transactions",
    accounts: "Accounts",
    categories: "Categories",
    goals: "Goals",
    taxes: "Taxes",
  };

  const addModalMap: Record<
    AddablePage,
    "transaction" | "account" | "category" | "goal"
  > = {
    transactions: "transaction",
    accounts: "account",
    categories: "category",
    goals: "goal",
  };

  function isAddable(page: Page): page is AddablePage {
    return page in addModalMap;
  }
</script>

<header
  class="sticky top-0 z-10 h-16 flex items-center gap-3 px-5 bg-base-100/70 backdrop-blur-md border-b border-base-300"
>
  <button
    aria-label="button to open sidebar"
    type="button"
    class="btn btn-ghost btn-sm btn-square lg:hidden"
    onclick={() => sidebarOpen.update((v) => !v)}
  >
    <svg
      class="w-5 h-5 opacity-80"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </button>

  <div class="flex-1 min-w-0">
    <h1 class="text-lg font-semibold tracking-tight text-base-content truncate">
      {pageTitles[$activePage as Page] ?? ""}
    </h1>
  </div>

  {#if isAddable($activePage as Page)}
    <button
      class="hidden lg:inline-flex btn btn-primary btn-sm rounded-xl px-4 gap-2 shadow-sm"
      type="button"
      onclick={() => modalType.set(addModalMap[$activePage as AddablePage])}
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
          stroke-width="2.5"
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span class="hidden sm:inline">Add</span>
    </button>
  {/if}
</header>
