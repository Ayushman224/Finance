import { Plus } from 'lucide-react'
import { cardClass, glowBtnClass } from '../ui/Card'
import { BalanceLineChart } from '../charts/BalanceLineChart'
import { CategoryExpensePie } from '../charts/CategoryExpensePie'
import { formatCurrency } from '../../utils/finance'

export function OverviewSection({
  balance,
  income,
  expenses,
  trendData,
  categoryData,
  recentTransactions,
  onAddTransaction,
  onViewLedger,
}) {
  return (
    <section className="mt-6 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-violet-400/80">Vanguard tier</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Market Nexus{' '}
            <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(168,85,247,0.45)]">
              Overview
            </span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Real-time financial synthesis and predictive asset trajectory for the Vanguard Tier.
          </p>
        </div>
        <button type="button" className={glowBtnClass} onClick={onAddTransaction}>
          <span className="inline-flex items-center gap-2">
            <Plus size={18} strokeWidth={2.5} />
            Add Transaction
          </span>
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className={cardClass}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Total liquidity</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">{formatCurrency(balance)}</p>
          <span className="mt-3 inline-flex rounded-full border border-violet-500/30 bg-violet-500/15 px-2.5 py-1 text-xs font-semibold text-violet-300 shadow-[0_0_16px_rgba(168,85,247,0.25)]">
            +12.4%
          </span>
        </article>
        <article className={cardClass}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Monthly inflow</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">{formatCurrency(income)}</p>
          <span className="mt-3 inline-flex rounded-full border border-blue-500/30 bg-blue-500/15 px-2.5 py-1 text-xs font-semibold text-blue-300">
            Monthly
          </span>
        </article>
        <article className={cardClass}>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">Operational burn</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">{formatCurrency(expenses)}</p>
          <span className="mt-3 inline-flex rounded-full border border-rose-500/35 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-300">
            Alert
          </span>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <article className={cardClass}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold text-zinc-100">Portfolio trajectory</h3>
              <p className="text-xs text-zinc-500">Balance over time</p>
            </div>
            <div className="flex rounded-full border border-white/10 bg-zinc-950/80 p-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              {['1W', '1M', '1Y'].map((t, i) => (
                <span
                  key={t}
                  className={`rounded-full px-2.5 py-1 ${i === 0 ? 'bg-violet-600/40 text-violet-200' : ''}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <BalanceLineChart data={trendData} />
        </article>
        <article className={cardClass}>
          <h3 className="text-lg font-semibold text-zinc-100">Asset allocation</h3>
          <p className="text-xs text-zinc-500">Expense mix by category</p>
          <CategoryExpensePie categoryData={categoryData} />
        </article>
      </div>

      <article className={cardClass}>
        <div className="mb-4 flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold text-zinc-100">Live feed</h3>
          <button
            type="button"
            onClick={onViewLedger}
            className="text-xs font-semibold uppercase tracking-wider text-violet-400 hover:text-violet-300"
          >
            View ledger
          </button>
        </div>
        <ul className="space-y-2">
          {recentTransactions.length ? (
            recentTransactions.map((t) => (
              <li
                key={t.id}
                className="group flex items-center gap-3 rounded-xl border border-white/5 bg-zinc-950/40 px-3 py-3 transition hover:border-violet-500/20"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/30 to-blue-600/20 text-xs font-bold text-violet-200">
                  {t.category.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-100">{t.note}</p>
                  <p className="text-xs text-zinc-500">
                    {t.category} · {new Date(t.date).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${t.type === 'income' ? 'text-violet-300' : 'text-zinc-300'}`}>
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">#{t.id}</p>
                </div>
              </li>
            ))
          ) : (
            <li className="py-6 text-center text-sm text-zinc-500">No transactions yet.</li>
          )}
        </ul>
      </article>
    </section>
  )
}
