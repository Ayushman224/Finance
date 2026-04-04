export function SettingsModalContent({ transactionCount, onExportJson, onResetDemoData, resetDisabled }) {
  return (
    <div className="space-y-4 text-zinc-300">
      <p>Manage how this demo behaves in your browser. Data stays local only.</p>
      <div className="rounded-xl border border-white/10 bg-zinc-950/80 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Data</p>
        <p className="mt-1 text-sm">
          <span className="font-semibold text-zinc-100">{transactionCount}</span> transactions in local storage.
        </p>
        <button
          type="button"
          className="mt-3 w-full rounded-xl border border-white/10 bg-zinc-900 py-2.5 text-sm font-medium text-zinc-200 hover:border-violet-500/40"
          onClick={onExportJson}
        >
          Download JSON backup
        </button>
        <button
          type="button"
          disabled={resetDisabled}
          className="mt-2 w-full rounded-xl border border-rose-500/30 bg-rose-950/40 py-2.5 text-sm font-medium text-rose-200 hover:bg-rose-950/60 disabled:cursor-not-allowed disabled:opacity-45"
          onClick={onResetDemoData}
        >
          Reset to demo data
        </button>
        <p className="mt-2 text-xs text-zinc-500">Admin only. Replaces your ledger with the built-in sample.</p>
      </div>
    </div>
  )
}
