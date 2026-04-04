export function SupportModalContent({ repoUrl, supportEmail }) {
  const mailHref = `mailto:${supportEmail}?subject=Precision%20Ledger%20support`

  return (
    <div className="space-y-4">
      <p className="text-slate-600">
        This dashboard is a frontend demo. For questions about the build or deployment, use the options below.
      </p>
      <ul className="list-inside list-disc space-y-2 text-sm text-slate-700">
        <li>
          <a href={repoUrl} className="font-medium text-blue-600 hover:underline" target="_blank" rel="noreferrer">
            View project on GitHub
          </a>
        </li>
        <li>
          <a href={mailHref} className="font-medium text-blue-600 hover:underline">
            Email {supportEmail}
          </a>
        </li>
      </ul>
      <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">
        Tip: On the Transactions page, use <strong>Download CSV</strong> to export only the rows that match your current search, type, date range, and sort. The header download icon exports the full ledger.
      </p>
    </div>
  )
}
