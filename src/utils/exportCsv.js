function escapeCsvField(value) {
  const s = String(value ?? '')
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

export function downloadTransactionsCsv(transactions, fileLabel = 'ledger') {
  const headers = ['id', 'date', 'amount', 'category', 'type', 'note']
  const lines = [
    headers.join(','),
    ...transactions.map((t) =>
      [t.id, t.date, t.amount, t.category, t.type, escapeCsvField(t.note)].join(','),
    ),
  ]
  const csv = lines.join('\n')
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const safe = String(fileLabel).replace(/[^a-zA-Z0-9-_]/g, '-')
  a.download = `precision-ledger-${safe}-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadTransactionsJson(transactions) {
  const json = JSON.stringify(transactions, null, 2)
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `precision-ledger-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
