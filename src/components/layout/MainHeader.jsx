import { useEffect, useRef, useState } from 'react'
import { Bell, CircleUserRound, Download } from 'lucide-react'

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: 'Monthly snapshot', body: 'Your spending summary for this month is ready to review.', time: '2h ago', read: false },
  { id: 2, title: 'Large outflow', body: 'A transaction above your usual threshold was recorded.', time: 'Yesterday', read: false },
  { id: 3, title: 'Ledger synced', body: 'Local data was saved successfully in this browser.', time: '3 days ago', read: true },
]

function PopoverPanel({ children, className = '' }) {
  return (
    <div
      className={`absolute right-0 top-[calc(100%+8px)] z-50 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-lg ${className}`}
    >
      {children}
    </div>
  )
}

export function MainHeader({ section, onTabChange, role, onRoleChange, onExportCsv }) {
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

  const copyEmail = () => {
    navigator.clipboard?.writeText('alex.sterling@precisionledger.app').catch(() => {})
  }

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
        <button
          type="button"
          className="rounded-xl border border-slate-300 bg-white p-2 hover:bg-slate-50"
          title="Export ledger as CSV"
          onClick={onExportCsv}
        >
          <Download size={16} />
        </button>
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            className="relative rounded-xl border border-slate-300 bg-white p-2 hover:bg-slate-50"
            title="Notifications"
            aria-expanded={notifOpen}
            onClick={() => {
              setNotifOpen((v) => !v)
              setProfileOpen(false)
            }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {notifOpen && (
            <PopoverPanel>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Notifications</p>
                {unreadCount > 0 && (
                  <button type="button" className="text-xs font-medium text-blue-600 hover:underline" onClick={markAllRead}>
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
                        n.read ? 'border-slate-100 bg-slate-50' : 'border-blue-100 bg-blue-50/60'
                      }`}
                      onClick={() => markRead(n.id)}
                    >
                      <p className="font-medium text-slate-900">{n.title}</p>
                      <p className="mt-0.5 text-xs text-slate-600">{n.body}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{n.time}</p>
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
            className="rounded-xl border border-slate-300 bg-white p-2 hover:bg-slate-50"
            title="Profile"
            aria-expanded={profileOpen}
            onClick={() => {
              setProfileOpen((v) => !v)
              setNotifOpen(false)
            }}
          >
            <CircleUserRound size={16} />
          </button>
          {profileOpen && (
            <PopoverPanel>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Signed in as</p>
              <p className="mt-1 text-base font-semibold text-slate-900">Alex Sterling</p>
              <p className="mt-2 text-sm text-slate-600">
                Access: <span className="font-medium capitalize text-slate-800">{role}</span>
              </p>
              <p className="mt-2 text-xs text-slate-500">Premium workspace · Precision Ledger</p>
              <button
                type="button"
                className="mt-3 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
                onClick={copyEmail}
              >
                Copy work email
              </button>
            </PopoverPanel>
          )}
        </div>
      </div>
    </header>
  )
}
