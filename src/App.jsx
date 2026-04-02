import { useState, useEffect, useRef, useCallback } from 'react'
import { INITIAL_TRANSACTIONS } from './constants/finance'
import { todayIso } from './utils/finance'
import { useDashboardDerived } from './hooks/useDashboardDerived'
import { Sidebar } from './components/layout/Sidebar'
import { MainHeader } from './components/layout/MainHeader'
import { OverviewSection } from './components/dashboard/OverviewSection'
import { TransactionsSection } from './components/dashboard/TransactionsSection'
import { AnalyticsSection } from './components/dashboard/AnalyticsSection'
import { AddTransactionForm } from './components/dashboard/AddTransactionForm'

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finance-transactions')
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS
  })
  const [role, setRole] = useState(() => localStorage.getItem('finance-role') || 'viewer')
  const [section, setSection] = useState('overview')
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    date: todayIso(),
    amount: '',
    category: 'Groceries',
    type: 'expense',
    note: '',
  })
  const addFormRef = useRef(null)

  const {
    income,
    expenses,
    balance,
    trendData,
    categoryData,
    highestSpend,
    monthlyComparison,
    observation,
    filteredTransactions,
  } = useDashboardDerived(transactions, query, filterType, sortBy)

  useEffect(() => {
    localStorage.setItem('finance-transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('finance-role', role)
  }, [role])

  const resetForm = () => {
    setForm({ date: todayIso(), amount: '', category: 'Groceries', type: 'expense', note: '' })
    setEditingId(null)
  }

  const scrollToAddForm = useCallback(() => {
    requestAnimationFrame(() => {
      addFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    })
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    if (role !== 'admin') return
    const parsedAmount = Number(String(form.amount).replace(/,/g, ''))
    const category = form.category.trim()
    if (!form.date || !Number.isFinite(parsedAmount) || parsedAmount <= 0 || !category) return

    if (editingId) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                date: form.date,
                amount: parsedAmount,
                category,
                type: form.type,
                note: form.note.trim() || 'No note',
              }
            : t,
        ),
      )
    } else {
      const newTx = {
        id: Date.now(),
        date: form.date,
        amount: parsedAmount,
        category,
        type: form.type,
        note: form.note.trim() || 'No note',
      }
      setTransactions((prev) => [newTx, ...prev])
      setSection('transactions')
      setQuery('')
      setFilterType('all')
      setSortBy('newest')
    }
    resetForm()
  }

  const startEdit = (tx) => {
    if (role !== 'admin') return
    setEditingId(tx.id)
    setForm({
      date: tx.date,
      amount: tx.amount.toString(),
      category: tx.category,
      type: tx.type,
      note: tx.note,
    })
  }

  const deleteTransaction = (id) => {
    if (role !== 'admin') return
    setTransactions((prev) => prev.filter((t) => t.id !== id))
    if (editingId === id) resetForm()
  }

  const handleTabChange = (tab) => {
    if (tab === 'portfolio') setSection('overview')
    else if (tab === 'ledger') setSection('transactions')
    else setSection('analytics')
  }

  const handleRoleChange = (nextRole) => {
    setRole(nextRole)
    if (nextRole !== 'admin' && editingId) {
      resetForm()
    }
  }

  const formFieldsLocked = role !== 'admin'
  const submitLocked = role !== 'admin'

  return (
    <div className="h-screen overflow-hidden bg-slate-100 text-slate-900">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[220px_1fr]">
        <Sidebar
          section={section}
          onNavigate={setSection}
          role={role}
          onAddTransaction={() => {
            setSection('transactions')
            scrollToAddForm()
          }}
        />

        <main className="h-screen overflow-y-auto p-4 md:p-7">
          <MainHeader
            section={section}
            onTabChange={handleTabChange}
            role={role}
            onRoleChange={handleRoleChange}
          />

          {section === 'overview' && (
            <OverviewSection
              balance={balance}
              income={income}
              expenses={expenses}
              trendData={trendData}
              categoryData={categoryData}
            />
          )}

          {section === 'transactions' && (
            <TransactionsSection
              query={query}
              onQueryChange={setQuery}
              filterType={filterType}
              onFilterTypeChange={setFilterType}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filteredTransactions={filteredTransactions}
              role={role}
              onEdit={startEdit}
              onDelete={deleteTransaction}
            />
          )}

          {section === 'analytics' && (
            <AnalyticsSection
              balance={balance}
              income={income}
              expenses={expenses}
              trendData={trendData}
              highestSpend={highestSpend}
              observation={observation}
              monthlyComparison={monthlyComparison}
            />
          )}

          <AddTransactionForm
            ref={addFormRef}
            editingId={editingId}
            role={role}
            form={form}
            onFormChange={setForm}
            onSubmit={onSubmit}
            onCancelEdit={resetForm}
            formFieldsLocked={formFieldsLocked}
            submitLocked={submitLocked}
            viewerMessage="Select Admin role to add, edit, or delete transactions. Viewer role is read-only."
          />
        </main>
      </div>
    </div>
  )
}

export default App
