import { useMemo } from 'react'
import {
  summarize,
  buildTrendData,
  buildCategoryData,
  buildHighestSpendLabel,
  buildMonthlyComparison,
  buildObservation,
  filterAndSortTransactions,
  formatCurrency,
} from '../utils/finance'

export function useDashboardDerived(transactions, query, filterType, sortBy, dateRange = 'all') {
  const { income, expenses, balance } = useMemo(() => summarize(transactions), [transactions])

  const trendData = useMemo(() => buildTrendData(transactions), [transactions])

  const categoryData = useMemo(() => buildCategoryData(transactions), [transactions])

  const highestSpend = useMemo(
    () => buildHighestSpendLabel(categoryData, formatCurrency),
    [categoryData],
  )

  const monthlyComparison = useMemo(
    () => buildMonthlyComparison(trendData, formatCurrency),
    [trendData],
  )

  const observation = useMemo(
    () => buildObservation(transactions, income, expenses),
    [transactions, income, expenses],
  )

  const filteredTransactions = useMemo(
    () => filterAndSortTransactions(transactions, query, filterType, sortBy, dateRange),
    [transactions, query, filterType, sortBy, dateRange],
  )

  return {
    income,
    expenses,
    balance,
    trendData,
    categoryData,
    highestSpend,
    monthlyComparison,
    observation,
    filteredTransactions,
  }
}
