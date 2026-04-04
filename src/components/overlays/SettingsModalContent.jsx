export function SettingsModalContent({ transactionCount, onExportJson, onResetDemoData, resetDisabled }) {
  return (
    <div className="space-y-4">
      <p className="text-slate-600">
        Manage how this demo app behaves in your browser. Data is stored locally only (no server).
      </p>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Data</p>
        <p className="mt-1 text-sm text-slate-700">
          <span className="font-semibold">{transactionCount}</span> transactions in local storage.
        </p>
        <button
          type="button"
          className="mt-3 w-full rounded-lg border border-slate-300 bg-white py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          onClick={onExportJson}
        >
          Download JSON backup
        </button>
        <button
          type="button"
          disabled={resetDisabled}
          className="mt-2 w-full rounded-lg border border-rose-200 bg-rose-50 py-2 text-sm font-medium text-rose-800 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={onResetDemoData}
        >
          Reset to demo data
        </button>
        <p className="mt-2 text-xs text-slate-500">Reset clears your edits and restores the built-in sample ledger. Admin only.</p>
      </div>
    </div>
  )
}
