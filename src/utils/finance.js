export const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value)

export const todayIso = () => new Date().toISOString().slice(0, 10)

export const monthLabel = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short' })

export const summarize = (transactions) => {
  const income = transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)
  return { income, expenses, balance: income - expenses }
}

export const buildTrendData = (transactions) => {
  const monthly = {}
  transactions
    .slice()
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .forEach((t) => {
      const key = `${new Date(t.date).getFullYear()}-${new Date(t.date).getMonth() + 1}`
      if (!monthly[key]) {
        monthly[key] = { month: monthLabel(t.date), income: 0, expenses: 0 }
      }
      monthly[key][t.type === 'income' ? 'income' : 'expenses'] += t.amount
    })

  let runningBalance = 0
  return Object.values(monthly).map((m) => {
    runningBalance += m.income - m.expenses
    return { ...m, balance: runningBalance }
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
    if (sortBy === 'newest') return new Date(b.date) - new Date(a.date)
    if (sortBy === 'oldest') return new Date(a.date) - new Date(b.date)
    if (sortBy === 'amountHigh') return b.amount - a.amount
    if (sortBy === 'amountLow') return a.amount - b.amount
    return 0
  })
  return list
}
