<script lang="ts">
  import { fmt, fmtPct, taxes } from "../stores/app";
</script>

<!-- MOBILE: Card per year -->
<div class="flex flex-col gap-5 lg:hidden">
  {#each $taxes as t}
    <div
      class="card bg-base-200 rounded-2xl shadow-sm hover:shadow-md transition"
    >
      <div class="card-body p-6 gap-5">
        <!-- Header -->
        <div class="flex items-start justify-between">
          <div class="flex flex-col">
            <span class="text-3xl font-bold leading-none">
              {t.tax_year}
            </span>
            <span class="text-xs text-base-content/40 mt-1">
              Tax Overview
            </span>
          </div>

          <span class="badge badge-error badge-outline text-xs">
            {fmtPct(t.percent_of_income)} of income
          </span>
        </div>

        <!-- Bruto income -->
        <div class="bg-base-300/70 rounded-xl p-4">
          <p
            class="text-[11px] uppercase tracking-wider text-base-content/40 mb-1"
          >
            Bruto Income
          </p>
          <p class="text-xl font-semibold text-success">
            {fmt(t.bruto_income)}
          </p>
        </div>

        <!-- Tax + savings -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-base-300/70 rounded-xl p-4">
            <p
              class="text-[11px] uppercase tracking-wider text-base-content/40 mb-1"
            >
              Tax Est.
            </p>
            <p class="text-base font-semibold text-error">
              {fmt(t.tax_estimation)}
            </p>
          </div>

          <div class="bg-base-300/70 rounded-xl p-4">
            <p
              class="text-[11px] uppercase tracking-wider text-base-content/40 mb-1"
            >
              Save / Month
            </p>
            <p class="text-base font-semibold text-warning">
              {fmt(t.minimum_savings_month)}
            </p>
          </div>
        </div>

        <!-- Progress -->
        <div class="pt-3 border-t border-base-300">
          <div class="flex justify-between text-xs text-base-content/50 mb-2">
            <span>Tax Burden</span>
            <span class="font-medium">
              {fmtPct(t.percent_of_income)}
            </span>
          </div>

          <progress
            class="progress progress-error w-full h-2"
            value={(t.percent_of_income ?? 0) * 100}
            max="100"
          ></progress>
        </div>
      </div>
    </div>
  {/each}

  {#if $taxes.length === 0}
    <div class="py-20 text-center text-base-content/30 text-sm">
      No tax data yet.
    </div>
  {/if}
</div>

<!-- DESKTOP: Table -->
<div class="card bg-base-200 rounded-2xl shadow-sm hidden lg:block">
  <div class="card-body p-0">
    <div class="overflow-x-auto">
      <table class="table table-sm">
        <thead>
          <tr class="text-[11px] uppercase tracking-wider text-base-content/40">
            <th class="px-6">Year</th>
            <th>Bruto Income</th>
            <th>Tax Estimation</th>
            <th>% of Income</th>
            <th class="text-right pr-6">Min. Savings/Mo</th>
          </tr>
        </thead>

        <tbody>
          {#each $taxes as t}
            <tr class="hover transition">
              <td class="px-6 py-4">
                <span class="font-semibold text-base">
                  {t.tax_year}
                </span>
              </td>

              <td class="text-success font-medium whitespace-nowrap">
                {fmt(t.bruto_income)}
              </td>

              <td class="text-error font-semibold whitespace-nowrap">
                {fmt(t.tax_estimation)}
              </td>

              <td>
                <div class="flex items-center gap-3">
                  <progress
                    class="progress progress-error w-20 h-1.5"
                    value={(t.percent_of_income ?? 0) * 100}
                    max="100"
                  ></progress>
                  <span class="text-xs font-medium">
                    {fmtPct(t.percent_of_income)}
                  </span>
                </div>
              </td>

              <td
                class="text-warning font-medium text-right pr-6 whitespace-nowrap"
              >
                {fmt(t.minimum_savings_month)}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if $taxes.length === 0}
      <div class="py-20 text-center text-base-content/30 text-sm">
        No tax data yet.
      </div>
    {/if}
  </div>
</div>
