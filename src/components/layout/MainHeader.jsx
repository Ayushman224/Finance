import { Bell, CircleUserRound, Download } from 'lucide-react'

export function MainHeader({ section, onTabChange, role, onRoleChange }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div className="inline-flex rounded-full bg-slate-200 p-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-600">
        {['portfolio', 'ledger', 'reports'].map((tab) => {
          const active =
            (tab === 'portfolio' && section === 'overview') ||
            (tab === 'ledger' && section === 'transactions') ||
            (tab === 'reports' && section === 'analytics')
          return (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`rounded-full px-4 py-1.5 ${active ? 'bg-white text-slate-900 shadow-sm' : ''}`}
            >
              {tab}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
          Role: {role}
        </span>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value)}
          className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>
        <button type="button" className="rounded-xl border border-slate-300 bg-white p-2">
          <Download size={16} />
        </button>
        <button type="button" className="rounded-xl border border-slate-300 bg-white p-2">
          <Bell size={16} />
        </button>
        <button type="button" className="rounded-xl border border-slate-300 bg-white p-2">
          <CircleUserRound size={16} />
        </button>
      </div>
    </header>
  )
}
