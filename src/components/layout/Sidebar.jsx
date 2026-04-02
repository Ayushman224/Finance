import { ChartColumn, HelpCircle, LayoutDashboard, NotebookTabs, PlusCircle, Settings } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: NotebookTabs },
  { id: 'analytics', label: 'Analytics', icon: ChartColumn },
]

export function Sidebar({ section, onNavigate, onAddTransaction, role }) {
  return (
    <aside className="hidden h-screen border-r border-slate-200 bg-[#f5f7fb] px-5 py-6 lg:flex lg:flex-col">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Precision Ledger</h2>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">The Editorial Architect</p>
      </div>
      <nav className="mt-10 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = section === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                active ? 'border-r-4 border-blue-600 bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-200/70'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </button>
          )
        })}
      </nav>
      <button
        type="button"
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow hover:bg-blue-700"
        onClick={onAddTransaction}
      >
        <PlusCircle size={16} />
        Add Transaction
      </button>
      {role !== 'admin' && (
        <p className="mt-2 text-xs text-amber-700">Switch to Admin to modify data.</p>
      )}
      <div className="mt-6 space-y-3 text-sm text-slate-600">
        <button type="button" className="flex items-center gap-2 text-left hover:text-slate-800">
          <Settings size={15} />
          <span>Settings</span>
        </button>
        <button type="button" className="flex items-center gap-2 text-left hover:text-slate-800">
          <HelpCircle size={15} />
          <span>Support</span>
        </button>
      </div>
    </aside>
  )
}
