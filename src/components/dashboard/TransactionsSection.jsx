import { Pencil, Search, Trash2 } from 'lucide-react'
import { cardClass } from '../ui/Card'
import { formatCurrency } from '../../utils/finance'

export function TransactionsSection({
  query,
  onQueryChange,
  filterType,
  onFilterTypeChange,
  sortBy,
  onSortChange,
  filteredTransactions,
  role,
  onEdit,
  onDelete,
}) {
  return (
    <section className="mt-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Financial Narrative</h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            A meticulous record of the capital flow. Review and manage the architectural integrity of your financial ledger.
          </p>
        </div>
      </div>

      <div className={`${cardClass} p-4`}>
        {role !== 'admin' && (
          <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
            Viewer mode is read-only. Select Admin role to add, edit, or delete transactions.
          </p>
        )}
        <div className="mb-4 flex flex-wrap gap-3">
          <label className="relative min-w-[260px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search transactions, entities, references..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none ring-blue-500 focus:ring"
            />
          </label>
          <select
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          >
            <option value="all">All Categories</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm"
          >
            <option value="newest">Last 30 Days</option>
            <option value="oldest">Oldest First</option>
            <option value="amountHigh">Amount High to Low</option>
            <option value="amountLow">Amount Low to High</option>
          </select>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-y-2 text-sm">
            <thead className="text-left text-xs uppercase tracking-[0.16em] text-slate-400">
              <tr>
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">Description</th>
                <th className="px-3 py-2 font-semibold">Category</th>
                <th className="px-3 py-2 font-semibold">Type</th>
                <th className="px-3 py-2 font-semibold">Amount</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length ? (
                filteredTransactions.map((t) => (
                  <tr key={t.id} className="rounded-2xl bg-white shadow-sm">
                    <td className="rounded-l-xl px-3 py-3 font-medium">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                    <td className="px-3 py-3">
                      <p className="font-semibold text-slate-900">{t.note}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-400">Ref #{t.id}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                        {t.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 italic text-slate-600">
                      {t.type === 'expense' ? 'Operational Expense' : 'Asset Income'}
                    </td>
                    <td className={`px-3 py-3 text-lg font-bold ${t.type === 'expense' ? 'text-rose-700' : 'text-emerald-700'}`}>
                      {t.type === 'expense' ? '-' : '+'}
                      {formatCurrency(t.amount)}
                    </td>
                    <td className="rounded-r-xl px-3 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 bg-slate-50 p-2 disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={role !== 'admin'}
                          onClick={() => onEdit(t)}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-rose-200 bg-rose-50 p-2 text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                          disabled={role !== 'admin'}
                          onClick={() => onDelete(t.id)}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-3 py-4 text-slate-500" colSpan={6}>
                    No transactions match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
