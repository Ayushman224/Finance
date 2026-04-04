import { useEffect, useRef, useState } from 'react'
import { Bell, CircleUserRound, Download, Search, Settings } from 'lucide-react'
import { getProfileSummaries } from '../../utils/profiles'

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Monthly snapshot', body: 'Your spending summary for this month is ready to review.', time: '2h ago', read: false },
  { id: 2, title: 'Large outflow', body: 'A transaction above your usual threshold was recorded.', time: 'Yesterday', read: false },
  { id: 3, title: 'Ledger synced', body: 'Local data was saved successfully in this browser.', time: '3 days ago', read: true },
]

function PopoverPanel({ children, className = '' }) {
  return (
    <div
      className={`absolute right-0 top-[calc(100%+8px)] z-50 w-80 rounded-xl border border-white/10 bg-zinc-900 p-3 shadow-[0_0_40px_-8px_rgba(0,0,0,0.8)] ${className}`}
    >
      {children}
    </div>
  )
}

export function MainHeader({
  section,
  onTabChange,
  role,
  onRoleChange,
  onExportCsv,
  query,
  onQueryChange,
  onOpenSettings,
  profileName,
  onOpenSwitchProfile,
  onSwitchProfile,
}) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  useEffect(() => {
    const onDoc = (e) => {
      const t = e.target
      if (notifRef.current && !notifRef.current.contains(t)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(t)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-white/10 bg-zinc-900/80 p-1 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
          {[
            { id: 'nexus', label: 'Nexus' },
            { id: 'ledger', label: 'Ledger' },
            { id: 'insights', label: 'Insights' },
          ].map(({ id: tab, label }) => {
            const active =
              (tab === 'nexus' && section === 'overview') ||
              (tab === 'ledger' && section === 'transactions') ||
              (tab === 'insights' && section === 'insights')
            return (
              <button
                key={tab}
                type="button"
                onClick={() => onTabChange(tab)}
                className={`rounded-full px-4 py-2 transition ${
                  active
                    ? 'bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.45)]'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="inline-flex rounded-full border border-white/10 bg-zinc-900/80 p-1">
            <button
              type="button"
              onClick={() => onRoleChange('admin')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                role === 'admin'
                  ? 'bg-violet-600 text-white shadow-[0_0_14px_rgba(168,85,247,0.5)]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => onRoleChange('viewer')}
              className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                role === 'viewer'
                  ? 'bg-zinc-700 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Viewer
            </button>
          </div>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-zinc-900/80 p-2.5 text-zinc-300 hover:border-violet-500/40 hover:text-white"
            title="Export full ledger CSV"
            onClick={onExportCsv}
          >
            <Download size={18} />
          </button>

          <button
            type="button"
            className="rounded-xl border border-white/10 bg-zinc-900/80 p-2.5 text-zinc-300 hover:border-violet-500/40 hover:text-white"
            title="Settings"
            onClick={onOpenSettings}
          >
            <Settings size={18} />
          </button>

          <div className="relative" ref={notifRef}>
            <button
              type="button"
              className="relative rounded-xl border border-white/10 bg-zinc-900/80 p-2.5 text-zinc-300 hover:border-violet-500/40 hover:text-white"
              aria-expanded={notifOpen}
              onClick={() => {
                setNotifOpen((v) => !v)
                setProfileOpen(false)
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-fuchsia-600 px-1 text-[10px] font-bold text-white shadow-[0_0_10px_#c026d3]">
                  {unreadCount}
                </span>
              )}
            </button>
            {notifOpen && (
              <PopoverPanel>
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Notifications</p>
                  {unreadCount > 0 && (
                    <button type="button" className="text-xs font-medium text-violet-400 hover:underline" onClick={markAllRead}>
                      Mark all read
                    </button>
                  )}
                </div>
                <ul className="max-h-72 space-y-2 overflow-y-auto">
                  {notifications.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                          n.read ? 'border-white/5 bg-zinc-800/50' : 'border-violet-500/30 bg-violet-950/40'
                        }`}
                        onClick={() => markRead(n.id)}
                      >
                        <p className="font-medium text-zinc-100">{n.title}</p>
                        <p className="mt-0.5 text-xs text-zinc-400">{n.body}</p>
                        <p className="mt-1 text-[11px] text-zinc-600">{n.time}</p>
                      </button>
                    </li>
                  ))}
                </ul>
              </PopoverPanel>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              className="rounded-xl border border-white/10 bg-zinc-900/80 p-2.5 text-zinc-300 hover:border-violet-500/40 hover:text-white"
              aria-expanded={profileOpen}
              onClick={() => {
                setProfileOpen((v) => !v)
                setNotifOpen(false)
              }}
            >
              <CircleUserRound size={18} />
            </button>
            {profileOpen && (
              <PopoverPanel>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Signed in as</p>
                <p className="mt-1 text-base font-semibold text-zinc-100">{profileName}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  Access: <span className="font-medium capitalize text-violet-300">{role}</span>
                </p>
                <p className="mt-2 text-xs text-zinc-600">Neon Launchpad · Vanguard Tier</p>

                {(() => {
                  const others = getProfileSummaries().filter((s) => s.name !== profileName)
                  if (!others.length) return null
                  return (
                    <div className="mt-3 border-t border-white/10 pt-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Saved profiles</p>
                      <ul className="mt-2 max-h-36 space-y-1 overflow-y-auto">
                        {others.map((s) => (
                          <li key={s.name}>
                            <button
                              type="button"
                              className="flex w-full items-center justify-between gap-2 rounded-lg border border-transparent px-2 py-2 text-left text-sm text-zinc-200 hover:border-violet-500/25 hover:bg-violet-950/30"
                              onClick={() => {
                                setProfileOpen(false)
                                onSwitchProfile(s.name)
                              }}
                            >
                              <span className="min-w-0 truncate font-medium">{s.name}</span>
                              <span className="shrink-0 text-[11px] text-zinc-500">{s.transactionCount} tx</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })()}

                <button
                  type="button"
                  className="mt-3 w-full rounded-lg border border-violet-500/30 bg-violet-600/20 py-2 text-sm font-medium text-violet-200 hover:bg-violet-600/30"
                  onClick={() => {
                    setProfileOpen(false)
                    onOpenSwitchProfile()
                  }}
                >
                  Switch profile
                </button>
              </PopoverPanel>
            )}
          </div>
        </div>
      </div>

      <label className="relative max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Scan ledger…"
          className="w-full rounded-2xl border border-white/10 bg-zinc-900/80 py-3 pl-12 pr-4 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none ring-violet-500/40 focus:ring-2"
        />
      </label>
    </header>
  )
}
