import { ChartColumn, HelpCircle, LayoutDashboard, NotebookTabs, PlusCircle, Settings, Sparkles, Users } from 'lucide-react'
import { profileInitials } from '../../utils/profiles'

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: NotebookTabs },
  { id: 'insights', label: 'Insights', icon: ChartColumn },
]

export function Sidebar({
  section,
  onNavigate,
  onAddTransaction,
  role,
  profileName,
  onOpenSwitchProfile,
  onOpenSettings,
  onOpenSupport,
}) {
  return (
    <aside className="hidden h-screen w-[248px] shrink-0 flex-col border-r border-white/10 bg-[#0a0a0b] px-4 py-6 lg:flex">
      <div>
        <h2 className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          Neon Launchpad
        </h2>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">Vanguard Tier</p>
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
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'border border-violet-500/40 bg-violet-500/10 text-violet-300 shadow-[0_0_20px_-6px_rgba(168,85,247,0.6)]'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
              }`}
            >
              <Icon size={18} className={active ? 'text-violet-400' : ''} />
              {item.label}
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-600/20 py-3 text-sm font-semibold text-violet-200 shadow-[0_0_24px_-8px_rgba(168,85,247,0.5)] transition hover:bg-violet-600/30"
        onClick={onAddTransaction}
      >
        <PlusCircle size={18} />
        Add Transaction
      </button>
      {role !== 'admin' && (
        <p className="mt-2 text-center text-[11px] text-amber-400/90">Switch to Admin to modify data.</p>
      )}

      <div className="mt-6 space-y-2 border-t border-white/10 pt-6 text-sm text-zinc-500">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/5 hover:text-zinc-200"
          onClick={onOpenSettings}
        >
          <Settings size={16} />
          <span>Settings</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/5 hover:text-zinc-200"
          onClick={onOpenSupport}
        >
          <HelpCircle size={16} />
          <span>Support</span>
        </button>
      </div>

      <div className="mt-6 space-y-2 rounded-xl border border-white/10 bg-zinc-900/80 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-blue-600 text-sm font-bold text-white">
            {profileInitials(profileName)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-zinc-100">{profileName}</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-400/90">
              {role === 'admin' ? 'Admin account' : 'Viewer account'}
            </p>
          </div>
          <Sparkles className="shrink-0 text-violet-500/60" size={16} />
        </div>
        <button
          type="button"
          onClick={onOpenSwitchProfile}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-violet-500/30 bg-violet-600/15 py-2 text-xs font-semibold text-violet-200 transition hover:bg-violet-600/25"
        >
          <Users size={14} />
          Switch profile
        </button>
      </div>
    </aside>
  )
}
