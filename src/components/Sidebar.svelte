<script lang="ts">
  import { activePage, fmt, sidebarOpen, totalBalance } from "../stores/app";

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      id: "transactions",
      label: "Transactions",
      icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
    },
    {
      id: "accounts",
      label: "Accounts",
      icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    },
    {
      id: "categories",
      label: "Categories",
      icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
    },
    {
      id: "goals",
      label: "Goals",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      id: "taxes",
      label: "Taxes",
      icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    },
  ];

  function navigate(id: string) {
    activePage.set(id);
    sidebarOpen.set(false);
  }
</script>

{#if $sidebarOpen}
  <button
    class="fixed inset-0 bg-black/50 z-20 lg:hidden"
    onclick={() => sidebarOpen.set(false)}>""</button
  >
{/if}

<aside
  class="fixed top-0 left-0 h-full w-64 z-30 flex flex-col
         bg-base-100 border-r border-base-300
         transition-transform duration-300 ease-out
         lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen"
  class:-translate-x-full={!$sidebarOpen}
>
  <div class="bg-primary">
    <img src="/logo.png" alt="Nexus" />
  </div>

  <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
    {#each navItems as item}
      <button
        class={`font-bold group flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-left
               text-sm transition-all duration-150 ${$activePage === item.id ? "bg-primary/10 text-primary" : "text-base-content/60 hover:bg-base-200 hover:text-base-content"}`}
        onclick={() => navigate(item.id)}
      >
        <svg
          class="w-4 h-4 shrink-0 transition-opacity duration-150"
          class:opacity-100={$activePage === item.id}
          class:opacity-60={$activePage !== item.id}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.8"
            d={item.icon}
          />
        </svg>

        <span class="truncate">{item.label}</span>

        {#if $activePage === item.id}
          <span class="ml-auto w-1.5 h-1.5 rounded-full bg-primary"></span>
        {/if}
      </button>
    {/each}
  </nav>

  <div class="px-5 py-4 border-t border-base-300 bg-base-100 font-extrabold">
    <p class="text-[10px] text-base-content/40 uppercase tracking-wider mb-1">
      Net Worth
    </p>
    <p class="text-primary text-2xl leading-tight">
      {fmt($totalBalance)}
    </p>
  </div>
</aside>
