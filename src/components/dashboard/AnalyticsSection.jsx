import { cardClass } from '../ui/Card'
import { IncomeExpenseLineChart } from '../charts/IncomeExpenseLineChart'
import { SavingsRatePie } from '../charts/SavingsRatePie'
import { formatCurrency } from '../../utils/finance'

export function AnalyticsSection({
  balance,
  income,
  expenses,
  trendData,
  highestSpend,
  observation,
  monthlyComparison,
}) {
  const savingsPct =
    income + expenses > 0 ? Math.min(99, Math.round(((income - expenses) / (income + expenses)) * 100)) : 0
  const roiLabel = savingsPct > 0 ? `${savingsPct}%` : '—'

  return (
    <section className="mt-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">Financial Insights</h1>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-300">
              Live analysis
            </span>
          </div>
          <p className="mt-2 text-sm text-zinc-500">Income vs. expenses and stability signals from your ledger.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Total net worth</p>
          <p className="mt-1 bg-gradient-to-r from-violet-300 to-blue-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
            {formatCurrency(balance)}
          </p>
          <span className="mt-2 inline-flex text-xs font-semibold text-emerald-400">+12.4%</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className={cardClass}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Total net worth</p>
          <p className="mt-2 text-2xl font-bold text-zinc-50">{formatCurrency(balance)}</p>
          <p className="mt-2 text-xs text-emerald-400">+12.4% trend</p>
        </article>
        <article className={cardClass}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">30d inflow</p>
          <p className="mt-2 text-2xl font-bold text-zinc-50">{formatCurrency(income)}</p>
          <p className="mt-2 text-xs text-emerald-400">+4.1%</p>
        </article>
        <article className={cardClass}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Monthly spend</p>
          <p className="mt-2 text-2xl font-bold text-zinc-50">{formatCurrency(expenses)}</p>
          <p className="mt-2 text-xs text-rose-400">-2.3%</p>
        </article>
        <article className={cardClass}>
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Yield signal</p>
          <p className="mt-2 text-2xl font-bold text-zinc-50">{roiLabel}</p>
          <span className="mt-2 inline-flex rounded-full border border-blue-500/25 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
            Stable
          </span>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <article className={cardClass}>
          <div className="flex flex-wrap items-center gap-4">
            <h3 className="text-lg font-semibold text-zinc-100">Income vs. expenses</h3>
            <div className="flex items-center gap-3 text-xs text-zinc-500">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-violet-400 shadow-[0_0_8px_#a855f7]" />
                Inflow
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_8px_#3b82f6]" />
                Outflow
              </span>
            </div>
          </div>
          <p className="text-xs text-zinc-500">Rolling months from your data</p>
          <IncomeExpenseLineChart data={trendData} />
        </article>

        <div className="space-y-4">
          <article className={cardClass}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Critical focus</p>
            <h3 className="mt-2 text-lg font-semibold text-zinc-100">Highest spending category</h3>
            <p className="mt-2 text-2xl font-bold text-rose-300">{highestSpend}</p>
          </article>
          <article className={cardClass}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Stability</p>
            <SavingsRatePie income={income} expenses={expenses} />
          </article>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <article className={`${cardClass} border-emerald-500/20 bg-emerald-950/20`}>
          <h3 className="font-semibold text-emerald-200">Observation</h3>
          <p className="mt-2 text-sm text-emerald-100/90">{observation}</p>
        </article>
        <article className={cardClass}>
          <h3 className="font-semibold text-zinc-100">Monthly comparison</h3>
          <p className="mt-2 text-sm text-zinc-400">{monthlyComparison}</p>
        </article>
      </div>
    </section>
  )
}
