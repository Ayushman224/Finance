export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export const todayIso = () => new Date().toISOString().slice(0, 10)

/**
 * Parse calendar date from YYYY-MM-DD in the user's local timezone.
 * Avoids `new Date('YYYY-MM-DD')` UTC parsing, which can shift the month
 * (e.g. April 1 UTC → March 31 in US timezones).
 */
export const parseIsoDateLocal = (iso) => {
  if (!iso || typeof iso !== 'string') return new Date(NaN)
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim())
  if (!m) return new Date(NaN)
  const y = Number(m[1])
  const mo = Number(m[2])
  const d = Number(m[3])
  if (!y || mo < 1 || mo > 12 || d < 1 || d > 31) return new Date(NaN)
  return new Date(y, mo - 1, d)
}

export const monthLabel = (dateStr) => {
  const d = parseIsoDateLocal(dateStr)
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-US', { month: 'short' })
}

export const summarize = (transactions) => {
  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  return { income, expenses, balance: income - expenses }
}

export const buildTrendData = (transactions) => {
  const monthly = {}
  transactions
    .slice()
    .sort((a, b) => parseIsoDateLocal(a.date) - parseIsoDateLocal(b.date))
    .forEach((t) => {
      const d = parseIsoDateLocal(t.date)
      if (Number.isNaN(d.getTime())) return
      const y = d.getFullYear()
      const monthNum = d.getMonth() + 1
      const key = `${y}-${String(monthNum).padStart(2, '0')}`
      if (!monthly[key]) {
        const short = d.toLocaleDateString('en-US', { month: 'short' })
        monthly[key] = {
          monthKey: key,
          label: `${short} '${String(y).slice(-2)}`,
          month: short,
          income: 0,
          expenses: 0,
        }
      }
      monthly[key][t.type === 'income' ? 'income' : 'expenses'] += t.amount
    })

  let runningBalance = 0
  return Object.keys(monthly)
    .sort()
    .map((key) => {
      const row = monthly[key]
      runningBalance += row.income - row.expenses
      return { ...row, balance: runningBalance }
    })
}

export const buildCategoryData = (transactions) => {
  const byCategory = {}
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount
    })
  return Object.entries(byCategory).map(([name, value]) => ({ name, value }))
}

export const buildHighestSpendLabel = (categoryData, format = formatCurrency) => {
  if (!categoryData.length) return 'No expense data available'
  const top = categoryData.reduce((max, item) => (item.value > max.value ? item : max))
  return `${top.name} (${format(top.value)})`
}

export const buildMonthlyComparison = (trendData, format = formatCurrency) => {
  if (trendData.length < 2) return 'Not enough monthly data for comparison'
  const current = trendData[trendData.length - 1]
  const previous = trendData[trendData.length - 2]
  const delta = (current.income - current.expenses) - (previous.income - previous.expenses)
  const direction = delta >= 0 ? 'up' : 'down'
  return `Net position is ${direction} by ${format(Math.abs(delta))} vs previous month`
}

export const buildObservation = (transactions, income, expenses) => {
  if (!transactions.length) return 'Add transactions to see tailored observations.'
  const ratio = income === 0 ? 0 : Math.round((expenses / income) * 100)
  if (ratio > 70) return 'Spending is above 70% of income. Consider tightening discretionary categories.'
  if (ratio > 50) return 'Spending is moderate and still healthy compared to income.'
  return 'Strong savings behavior this period. Great job keeping expenses controlled.'
}

/** ISO date string YYYY-MM-DD for start of "today minus n local calendar days". */
export const cutoffIsoDaysAgo = (days) => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - days)
  return d.toISOString().slice(0, 10)
}

export const filterAndSortTransactions = (transactions, query, filterType, sortBy, dateRange = 'all') => {
  const text = query.trim().toLowerCase()
  const cutoffLast30 = dateRange === 'last30' ? cutoffIsoDaysAgo(30) : null

  let list = transactions.filter((t) => {
    if (cutoffLast30 && t.date < cutoffLast30) return false
    const matchesType = filterType === 'all' || t.type === filterType
    const matchesText =
      !text ||
      t.category.toLowerCase().includes(text) ||
      t.note.toLowerCase().includes(text) ||
      t.amount.toString().includes(text)
    return matchesType && matchesText
  })

  list = [...list].sort((a, b) => {
    if (sortBy === 'newest') return parseIsoDateLocal(b.date) - parseIsoDateLocal(a.date)
    if (sortBy === 'oldest') return parseIsoDateLocal(a.date) - parseIsoDateLocal(b.date)
    if (sortBy === 'amountHigh') return b.amount - a.amount
    if (sortBy === 'amountLow') return a.amount - b.amount
    return 0
  })
  return list
}
