import { forwardRef } from 'react'
import { PlusCircle } from 'lucide-react'
import { cardClass, glowBtnClass } from '../ui/Card'

const inputClass =
  'min-w-0 flex-1 rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none ring-violet-500/30 focus:ring-2 disabled:opacity-45'

export const AddTransactionForm = forwardRef(function AddTransactionForm(
  {
    editingId,
    role,
    form,
    onFormChange,
    onSubmit,
    onCancelEdit,
    formFieldsLocked,
    submitLocked,
    viewerMessage,
  },
  ref,
) {
  return (
    <section id="add-transaction" ref={ref} className={`${cardClass} mt-6`}>
      <h3 className="text-xl font-semibold text-zinc-100">{editingId ? 'Edit transaction' : 'Add transaction'}</h3>
      <p className="mt-1 text-sm text-zinc-500">
        {editingId
          ? role === 'admin'
            ? 'Updates apply everywhere and persist in this browser.'
            : 'Switch to Admin to edit entries.'
          : 'New rows sync charts, totals, and local storage.'}
      </p>
      {role !== 'admin' && (
        <p className="mt-3 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-sm text-amber-200/90">
          {viewerMessage}
        </p>
      )}
      <form className="mt-4 flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-end" onSubmit={onSubmit}>
        <input
          type="date"
          value={form.date}
          onChange={(e) => onFormChange({ ...form, date: e.target.value })}
          disabled={formFieldsLocked}
          className={inputClass}
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => onFormChange({ ...form, amount: e.target.value })}
          disabled={formFieldsLocked}
          className={inputClass}
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => onFormChange({ ...form, category: e.target.value })}
          disabled={formFieldsLocked}
          className={inputClass}
        />
        <select
          value={form.type}
          onChange={(e) => onFormChange({ ...form, type: e.target.value })}
          disabled={formFieldsLocked}
          className={`${inputClass} min-w-[120px]`}
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="text"
          placeholder="Note / entity"
          value={form.note}
          onChange={(e) => onFormChange({ ...form, note: e.target.value })}
          disabled={formFieldsLocked}
          className={`${inputClass} min-w-[160px] flex-[2]`}
        />
        <div className="flex shrink-0 items-center gap-2">
          <button type="submit" className={`${glowBtnClass} py-2.5`} disabled={submitLocked}>
            <span className="inline-flex items-center gap-2">
              <PlusCircle size={16} />
              {editingId ? 'Save' : 'Add'}
            </span>
          </button>
          {editingId && (
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-zinc-950/80 px-4 py-2.5 text-sm text-zinc-200 hover:border-violet-500/40"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  )
})
