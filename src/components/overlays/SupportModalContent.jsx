export function SupportModalContent({ repoUrl, supportEmail }) {
  const mailHref = `mailto:${supportEmail}?subject=Neon%20Launchpad%20support`

  return (
    <div className="space-y-4 text-zinc-300">
      <p>Frontend demo only. For build or deployment questions, use the links below.</p>
      <ul className="list-inside list-disc space-y-2 text-sm">
        <li>
          <a href={repoUrl} className="font-medium text-violet-400 hover:text-violet-300 hover:underline" target="_blank" rel="noreferrer">
            View project on GitHub
          </a>
        </li>
        <li>
          <a href={mailHref} className="font-medium text-violet-400 hover:text-violet-300 hover:underline">
            Email {supportEmail}
          </a>
        </li>
      </ul>
      <p className="rounded-xl border border-white/5 bg-zinc-950/60 p-3 text-xs text-zinc-500">
        On Transactions, <strong className="text-zinc-400">Download CSV</strong> exports rows that match your filters. The header icon exports the full ledger.
      </p>
    </div>
  )
}
