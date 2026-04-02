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
  return (
    <section className="mt-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Insights & Analytics</h1>
          <p className="mt-2 text-slate-600">Financial performance summary for the fiscal quarter.</p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Total Net Growth</p>
          <p className="text-5xl font-bold text-blue-700">{formatCurrency(balance)}</p>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.9fr_1fr]">
        <article className={`${cardClass} bg-gradient-to-br from-indigo-50 to-slate-50`}>
          <p className="text-xs uppercase tracking-widest text-slate-500">Critical Alert</p>
          <h3 className="mt-8 text-xl font-semibold">Highest Spending Category</h3>
          <p className="mt-1 text-4xl font-bold text-rose-700">{highestSpend}</p>
        </article>
        <article className={cardClass}>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Savings Rate</p>
          <SavingsRatePie income={income} expenses={expenses} />
        </article>
        <div className="space-y-3">
          <article className={`${cardClass} border-emerald-200 bg-emerald-50`}>
            <h3 className="font-semibold text-emerald-800">Efficiency Boost</h3>
            <p className="mt-1 text-sm text-emerald-900">{observation}</p>
          </article>
          <article className={cardClass}>
            <h3 className="font-semibold">Monthly Comparison</h3>
            <p className="mt-1 text-sm text-slate-600">{monthlyComparison}</p>
          </article>
        </div>
      </div>

      <article className={cardClass}>
        <h3 className="text-2xl font-semibold">Income vs Expenses</h3>
        <p className="text-sm text-slate-500">Last months performance</p>
        <IncomeExpenseLineChart data={trendData} />
      </article>
    </section>
  )
}
