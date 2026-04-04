import { useMemo, useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'
import { getProfileSummaries } from '../../utils/profiles'

export function SwitchProfileModalContent({ currentName, onSwitch, onClose }) {
  const [value, setValue] = useState('')

  const summaries = useMemo(() => getProfileSummaries(), [])

  const submit = (e) => {
    e.preventDefault()
    const next = value.trim()
    if (!next) return
    onSwitch(next)
    setValue('')
  }

  const pickSaved = (name) => {
    if (name === currentName) return
    onSwitch(name)
  }

  return (
    <div className="space-y-5 text-zinc-300">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Saved profiles</p>
        <p className="mt-1 text-xs text-zinc-500">
          Tap a profile to load its stored ledger and role from this browser (same data as JSON export per profile).
        </p>
        <ul className="mt-3 max-h-52 space-y-1.5 overflow-y-auto rounded-xl border border-white/10 bg-zinc-950/60 p-2">
          {summaries.length === 0 ? (
            <li className="px-2 py-4 text-center text-sm text-zinc-500">No profiles in storage yet.</li>
          ) : (
            summaries.map(({ name, transactionCount, role }) => {
              const isCurrent = name === currentName
              return (
                <li key={name}>
                  <button
                    type="button"
                    disabled={isCurrent}
                    onClick={() => pickSaved(name)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                      isCurrent
                        ? 'cursor-default border border-violet-500/35 bg-violet-950/40 text-zinc-200'
                        : 'border border-transparent text-zinc-200 hover:border-violet-500/30 hover:bg-violet-950/25'
                    }`}
                  >
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate font-semibold">{name}</span>
                      <span className="text-[11px] text-zinc-500">
                        {transactionCount} transaction{transactionCount === 1 ? '' : 's'} · {role}
                      </span>
                    </span>
                    {isCurrent ? (
                      <span className="flex shrink-0 items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-violet-400">
                        <Check size={14} strokeWidth={2.5} />
                        Current
                      </span>
                    ) : (
                      <ChevronRight className="shrink-0 text-zinc-500" size={18} />
                    )}
                  </button>
                </li>
              )
            })
          )}
        </ul>
      </div>

      <form className="space-y-3 border-t border-white/10 pt-4" onSubmit={submit}>
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">New or other name</p>
        <p className="text-xs text-zinc-500">
          Names not in the list above start with an <strong className="text-zinc-300">empty ledger</strong>. An existing name always reloads what was last saved for it.
        </p>
        <p className="text-xs text-zinc-600">Active profile: {currentName}</p>
        <label className="block">
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-zinc-500">Profile name</span>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Type a name and switch…"
            className="w-full rounded-xl border border-white/10 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none ring-violet-500/30 focus:ring-2"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(139,92,246,0.35)]"
          >
            Switch / create
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/10 bg-zinc-800 px-4 py-2.5 text-sm text-zinc-200 hover:bg-zinc-700"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
