<script lang="ts">
  import { onMount } from "svelte";
  import BottomNav from "./components/BottomNav.svelte";

  import ModalAccount from "./components/modals/ModalAccount.svelte";
  import ModalCategory from "./components/modals/ModalCategory.svelte";
  import ModalGoal from "./components/modals/ModalGoal.svelte";
  import ModalTransaction from "./components/modals/ModalTransaction.svelte";
  import Sidebar from "./components/Sidebar.svelte";
  import Accounts from "./pages/Accounts.svelte";
  import Categories from "./pages/Categories.svelte";
  import Dashboard from "./pages/Dashboard.svelte";
  import Goals from "./pages/Goals.svelte";
  import Taxes from "./pages/Taxes.svelte";
  import Transactions from "./pages/Transactions.svelte";

  import Topbar from "./components/Topbar.svelte";
  import {
    activePage,
    isModalPage,
    loadAll,
    loading,
    modalType,
    type ModalPage,
    type ModalType,
  } from "./stores/app";

  const modalMap: Record<ModalPage, ModalType> = {
    transactions: "transaction",
    accounts: "account",
    categories: "category",
    goals: "goal",
  };

  onMount(loadAll);
</script>

<div class="flex min-h-screen bg-base-100">
  <Sidebar />

  <div class="flex flex-col flex-1 min-w-0">
    <div class="hidden lg:block">
      <Topbar />
    </div>

    <main class="flex-1 p-4 pb-24 lg:pb-6 overflow-y-auto">
      {#if $loading}
        <div
          class="flex flex-col items-center justify-center py-32 gap-4 text-base-content/30"
        >
          <span class="loading loading-spinner loading-lg text-primary"></span>
          <p class="text-sm">Loading data...</p>
        </div>
      {:else if $activePage === "dashboard"}
        <Dashboard />
      {:else if $activePage === "transactions"}
        <Transactions />
      {:else if $activePage === "accounts"}
        <Accounts />
      {:else if $activePage === "categories"}
        <Categories />
      {:else if $activePage === "goals"}
        <Goals />
      {:else if $activePage === "taxes"}
        <Taxes />
      {/if}
    </main>
  </div>
</div>

<BottomNav />

{#if isModalPage($activePage)}
  <button
    aria-label="button to open modal"
    class="lg:hidden fixed bottom-20 right-5 btn btn-primary btn-circle shadow-lg z-40"
    onclick={() => modalType.set(modalMap[$activePage])}
  >
    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"
        d="M12 4v16m8-8H4"
      />
    </svg>
  </button>
{/if}

{#if $modalType === "account"}
  <ModalAccount onClose={() => ($modalType = null)} />
{:else if $modalType === "category"}
  <ModalCategory onClose={() => ($modalType = null)} />
{:else if $modalType === "transaction"}
  <ModalTransaction onClose={() => ($modalType = null)} />
{:else if $modalType === "goal"}
  <ModalGoal onClose={() => ($modalType = null)} />
{/if}
