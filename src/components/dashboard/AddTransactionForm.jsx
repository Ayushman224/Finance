import { forwardRef } from 'react'
import { PlusCircle } from 'lucide-react'
import { cardClass } from '../ui/Card'

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
      <h3 className="text-xl font-semibold">{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
      <p className="mt-1 text-sm text-slate-500">
        {editingId
          ? role === 'admin'
            ? 'Update this entry. Changes apply everywhere and are saved in your browser.'
            : 'Switch to Admin role to edit transactions.'
          : 'New entries appear in the ledger below, update charts and totals, and are saved locally in your browser.'}
      </p>
      {role !== 'admin' && (
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {viewerMessage}
        </p>
      )}
      <form
        className="mt-4 flex flex-col gap-3 xl:flex-row xl:flex-wrap xl:items-end"
        onSubmit={onSubmit}
      >
        <input
          type="date"
          value={form.date}
          onChange={(e) => onFormChange({ ...form, date: e.target.value })}
          disabled={formFieldsLocked}
          className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:opacity-50"
        />
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => onFormChange({ ...form, amount: e.target.value })}
          disabled={formFieldsLocked}
          className="min-w-[120px] flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:opacity-50"
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => onFormChange({ ...form, category: e.target.value })}
          disabled={formFieldsLocked}
          className="min-w-[140px] flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:opacity-50"
        />
        <select
          value={form.type}
          onChange={(e) => onFormChange({ ...form, type: e.target.value })}
          disabled={formFieldsLocked}
          className="min-w-[120px] rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:opacity-50"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="text"
          placeholder="Note"
          value={form.note}
          onChange={(e) => onFormChange({ ...form, note: e.target.value })}
          disabled={formFieldsLocked}
          className="min-w-[160px] flex-[2] rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm disabled:opacity-50"
        />
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            disabled={submitLocked}
          >
            <PlusCircle size={14} />
            {editingId ? 'Save' : 'Add'}
          </button>
          {editingId && (
            <button
              type="button"
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
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
