import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Download, MoreVertical, Pencil, Plus, Trash2 } from 'lucide-react'
import { cardClass, glowBtnClass } from '../ui/Card'
import { formatCurrency } from '../../utils/finance'

const PAGE_SIZE = 8

function statusForTx(t) {
  if (t.type === 'income') {
    return { label: 'Credit', dot: 'bg-emerald-400', ring: 'shadow-[0_0_8px_rgba(52,211,153,0.6)]' }
  }
  const variants = [
    { label: 'Settled', dot: 'bg-blue-400', ring: 'shadow-[0_0_8px_rgba(96,165,250,0.5)]' },
    { label: 'Processing', dot: 'bg-violet-400', ring: 'shadow-[0_0_8px_rgba(167,139,250,0.5)]' },
  ]
  return variants[t.id % 2]
}

export function TransactionsSection({
  filterType,
  onFilterTypeChange,
  dateRange,
  onDateRangeChange,
  sortBy,
  onSortChange,
  filteredTransactions,
  onDownloadFiltered,
  role,
  onEdit,
  onDelete,
  onAddTransaction,
}) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const pageSlice = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return filteredTransactions.slice(start, start + PAGE_SIZE)
  }, [filteredTransactions, safePage])

  const rangeLabel =
    filteredTransactions.length === 0
      ? '0 entries'
      : `${(safePage - 1) * PAGE_SIZE + 1}-${Math.min(safePage * PAGE_SIZE, filteredTransactions.length)} of ${filteredTransactions.length}`

  const goPrev = () => setPage((p) => Math.max(1, Math.min(p, totalPages) - 1))
  const goNext = () => setPage((p) => Math.min(totalPages, Math.min(p, totalPages) + 1))

  return (
    <section className="mt-6 space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50 md:text-4xl">Transactions Ledger</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Search from the header, then refine by category and temporal range. Export matches your filters.
          </p>
        </div>
        <button type="button" className={`${glowBtnClass} uppercase tracking-wider`} onClick={onAddTransaction}>
          <span className="inline-flex items-center gap-2">
            <Plus size={18} strokeWidth={2.5} />
            Add transaction
          </span>
        </button>
      </div>

      <div className={`${cardClass} p-4`}>
        {role !== 'admin' && (
          <p className="mb-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-200/90">
            Viewer mode is read-only. Switch to Admin to add, edit, or delete.
          </p>
        )}
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Category</span>
            <select
              value={filterType}
              onChange={(e) => {
                onFilterTypeChange(e.target.value)
                setPage(1)
              }}
              className="rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-200 outline-none ring-violet-500/30 focus:ring-2"
            >
              <option value="all">All types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Temporal range</span>
            <select
              value={dateRange}
              onChange={(e) => {
                onDateRangeChange(e.target.value)
                setPage(1)
              }}
              className="rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-200 outline-none ring-violet-500/30 focus:ring-2"
            >
              <option value="all">All time</option>
              <option value="last30">Last 30 days</option>
            </select>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Sort</span>
            <select
              value={sortBy}
              onChange={(e) => {
                onSortChange(e.target.value)
                setPage(1)
              }}
              className="rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-200 outline-none ring-violet-500/30 focus:ring-2"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="amountHigh">Amount high to low</option>
              <option value="amountLow">Amount low to high</option>
            </select>
          </label>
          <button
            type="button"
            onClick={onDownloadFiltered}
            className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:border-violet-500/40 hover:text-white"
            title="Download CSV matching current filters"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>

        <div className="overflow-auto rounded-xl border border-white/5">
          <table className="w-full min-w-[880px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Transaction date</th>
                <th className="px-3 py-3 font-semibold">Entity / description</th>
                <th className="px-3 py-3 font-semibold">Category</th>
                <th className="px-3 py-3 font-semibold">Value</th>
                <th className="px-3 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageSlice.length ? (
                pageSlice.map((t) => {
                  const st = statusForTx(t)
                  const catTone =
                    t.type === 'income'
                      ? 'border-blue-500/25 bg-blue-500/10 text-blue-300'
                      : 'border-violet-500/25 bg-violet-500/10 text-violet-300'
                  return (
                    <tr
                      key={t.id}
                      className="group border-b border-white/5 transition hover:bg-white/[0.03]"
                    >
                      <td className="px-3 py-3">
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-zinc-300">
                          <span className={`h-2 w-2 rounded-full ${st.dot} ${st.ring}`} />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-medium text-zinc-300">{new Date(t.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-3 py-3">
                        <p className="font-semibold text-zinc-100">{t.note}</p>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">Ref #{t.id}</p>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${catTone}`}>
                          {t.category}
                        </span>
                      </td>
                      <td
                        className={`px-3 py-3 text-base font-bold ${t.type === 'expense' ? 'text-rose-300' : 'text-emerald-300'}`}
                      >
                        {t.type === 'expense' ? '-' : '+'}
                        {formatCurrency(t.amount)}
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            className="rounded-lg border border-white/10 p-2 text-zinc-400 opacity-0 transition group-hover:opacity-100 hover:border-violet-500/40 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-30"
                            disabled={role !== 'admin'}
                            onClick={() => onEdit(t)}
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            className="rounded-lg border border-white/10 p-2 text-zinc-400 opacity-0 transition group-hover:opacity-100 hover:border-rose-500/40 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-30"
                            disabled={role !== 'admin'}
                            onClick={() => onDelete(t.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                          <span className="p-2 text-zinc-600" aria-hidden>
                            <MoreVertical size={16} />
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td className="px-3 py-8 text-center text-zinc-500" colSpan={6}>
                    No transactions match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-500">
          <span className="font-semibold uppercase tracking-wider">Showing {rangeLabel}</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={goPrev}
              className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-violet-500/40 hover:text-zinc-200 disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="px-2 font-semibold text-zinc-400">
              Page {safePage} / {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={goNext}
              className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:border-violet-500/40 hover:text-zinc-200 disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
