import { cardClass } from '../ui/Card'
import { BalanceLineChart } from '../charts/BalanceLineChart'
import { CategoryExpensePie } from '../charts/CategoryExpensePie'
import { formatCurrency } from '../../utils/finance'

export function OverviewSection({ balance, income, expenses, trendData, categoryData }) {
  return (
    <section className="mt-6 space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Performance Audit</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight">Portfolio Summary</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-slate-500">Total Liquidity</p>
          <p className="mt-2 text-4xl font-semibold">{formatCurrency(balance)}</p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            +12.5%
            <span className="font-normal text-slate-600">vs previous month</span>
          </div>
        </article>
        <article className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-slate-500">Monthly Yield</p>
          <p className="mt-2 text-4xl font-semibold">{formatCurrency(income)}</p>
          <div className="mt-5 h-1.5 rounded-full bg-slate-100">
            <div className="h-full w-3/4 rounded-full bg-emerald-600" />
          </div>
        </article>
        <article className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-slate-500">Outflow</p>
          <p className="mt-2 text-4xl font-semibold">{formatCurrency(expenses)}</p>
          <div className="mt-5 h-1.5 rounded-full bg-slate-100">
            <div className="h-full w-1/2 rounded-full bg-rose-700" />
          </div>
        </article>
      </div>

      <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <article className={cardClass}>
          <h3 className="text-xl font-semibold">Growth Projection</h3>
          <p className="text-sm text-slate-500">Actual balance progression</p>
          <BalanceLineChart data={trendData} />
        </article>
        <article className={cardClass}>
          <h3 className="text-xl font-semibold">Categorical Drift</h3>
          <p className="text-sm text-slate-500">Expense distribution</p>
          <CategoryExpensePie categoryData={categoryData} />
        </article>
      </div>
    </section>
  )
}
