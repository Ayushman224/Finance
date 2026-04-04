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
import { Modal } from './components/ui/Modal'
import { SettingsModalContent } from './components/overlays/SettingsModalContent'
import { SupportModalContent } from './components/overlays/SupportModalContent'
import { SwitchProfileModalContent } from './components/overlays/SwitchProfileModalContent'
import { downloadTransactionsCsv, downloadTransactionsJson } from './utils/exportCsv'
import {
  getBootstrapState,
  normalizeProfileSlot,
  persistProfileSlot,
  readProfiles,
  setActiveProfileName,
} from './utils/profiles'

const REPO_URL = 'https://github.com/Ayushman224/Finance'
const SUPPORT_EMAIL = 'ayushmantripathi224@gmail.com'

function App() {
  const boot = getBootstrapState(INITIAL_TRANSACTIONS)
  const [profileName, setProfileName] = useState(boot.profileName)
  const [transactions, setTransactions] = useState(boot.transactions)
  const [role, setRole] = useState(boot.role)
  const [section, setSection] = useState('overview')
  const [query, setQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [dateRange, setDateRange] = useState('all')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({
    date: todayIso(),
    amount: '',
    category: 'Groceries',
    type: 'expense',
    note: '',
  })
  const addFormRef = useRef(null)
  const skipProfilePersistRef = useRef(false)
  const [activeModal, setActiveModal] = useState(null)

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
  } = useDashboardDerived(transactions, query, filterType, sortBy, dateRange)

  useEffect(() => {
    if (skipProfilePersistRef.current) {
      skipProfilePersistRef.current = false
      return
    }
    persistProfileSlot(profileName, { transactions, role })
  }, [transactions, role, profileName])

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
    if (tab === 'nexus') setSection('overview')
    else if (tab === 'ledger') setSection('transactions')
    else if (tab === 'insights') setSection('insights')
  }

  const recentForFeed = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5)

  const handleRoleChange = (nextRole) => {
    setRole(nextRole)
    if (nextRole !== 'admin' && editingId) {
      resetForm()
    }
  }

  const formFieldsLocked = role !== 'admin'
  const submitLocked = role !== 'admin'

  const handleExportCsv = () => {
    downloadTransactionsCsv(transactions, 'full-ledger')
  }

  const handleDownloadFilteredLedger = () => {
    downloadTransactionsCsv(filteredTransactions, 'filtered-ledger')
  }

  const handleExportJson = () => {
    downloadTransactionsJson(transactions)
  }

  const handleResetDemoData = () => {
    if (role !== 'admin') return
    if (!window.confirm('Reset all transactions to the built-in demo data? Your current ledger will be replaced.')) return
    setTransactions(INITIAL_TRANSACTIONS)
    resetForm()
    setActiveModal(null)
  }

  const handleSwitchProfile = (nextNameRaw) => {
    const nextName = nextNameRaw.trim()
    if (!nextName) return
    if (nextName === profileName) {
      setActiveModal(null)
      return
    }

    skipProfilePersistRef.current = true
    persistProfileSlot(profileName, { transactions, role })

    const map = readProfiles()
    setActiveProfileName(nextName)
    setProfileName(nextName)

    if (Object.prototype.hasOwnProperty.call(map, nextName) && map[nextName] != null) {
      const slot = normalizeProfileSlot(map[nextName])
      setTransactions(slot.transactions)
      setRole(slot.role)
    } else {
      setTransactions([])
      setRole('viewer')
      persistProfileSlot(nextName, { transactions: [], role: 'viewer' })
    }

    resetForm()
    setQuery('')
    setFilterType('all')
    setSortBy('newest')
    setDateRange('all')
    setSection('overview')
    setActiveModal(null)
  }

  return (
    <div className="h-screen overflow-hidden bg-[#050505] text-zinc-100">
      <div className="grid h-full grid-cols-1 lg:grid-cols-[248px_1fr]">
        <Sidebar
          section={section}
          onNavigate={setSection}
          role={role}
          profileName={profileName}
          onOpenSwitchProfile={() => setActiveModal('switchProfile')}
          onOpenSettings={() => setActiveModal('settings')}
          onOpenSupport={() => setActiveModal('support')}
          onAddTransaction={() => {
            setSection('transactions')
            scrollToAddForm()
          }}
        />

        <main className="neon-scroll h-screen overflow-y-auto bg-gradient-to-b from-[#050505] via-[#08080a] to-[#050505] p-4 md:p-7">
          <MainHeader
            section={section}
            onTabChange={handleTabChange}
            role={role}
            onRoleChange={handleRoleChange}
            onExportCsv={handleExportCsv}
            query={query}
            onQueryChange={setQuery}
            onOpenSettings={() => setActiveModal('settings')}
            profileName={profileName}
            onOpenSwitchProfile={() => setActiveModal('switchProfile')}
            onSwitchProfile={handleSwitchProfile}
          />

          {section === 'overview' && (
            <OverviewSection
              balance={balance}
              income={income}
              expenses={expenses}
              trendData={trendData}
              categoryData={categoryData}
              recentTransactions={recentForFeed}
              onAddTransaction={() => {
                setSection('transactions')
                scrollToAddForm()
              }}
              onViewLedger={() => setSection('transactions')}
            />
          )}

          {section === 'transactions' && (
            <TransactionsSection
              filterType={filterType}
              onFilterTypeChange={setFilterType}
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              sortBy={sortBy}
              onSortChange={setSortBy}
              filteredTransactions={filteredTransactions}
              onDownloadFiltered={handleDownloadFilteredLedger}
              role={role}
              onEdit={startEdit}
              onDelete={deleteTransaction}
              onAddTransaction={() => {
                scrollToAddForm()
              }}
            />
          )}

          {section === 'insights' && (
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

          <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            <span>© {new Date().getFullYear()} Neon Curator Finance. All rights reserved.</span>
            <div className="flex flex-wrap gap-4">
              <span className="cursor-pointer hover:text-zinc-400">Terms of service</span>
              <span className="cursor-pointer hover:text-zinc-400">Privacy policy</span>
              <span className="cursor-pointer hover:text-zinc-400">Compliance</span>
            </div>
          </footer>
        </main>
      </div>

      {activeModal === 'settings' && (
        <Modal title="Settings" onClose={() => setActiveModal(null)}>
          <SettingsModalContent
            transactionCount={transactions.length}
            onExportJson={handleExportJson}
            onResetDemoData={handleResetDemoData}
            resetDisabled={role !== 'admin'}
          />
        </Modal>
      )}
      {activeModal === 'support' && (
        <Modal title="Support" onClose={() => setActiveModal(null)}>
          <SupportModalContent repoUrl={REPO_URL} supportEmail={SUPPORT_EMAIL} />
        </Modal>
      )}
      {activeModal === 'switchProfile' && (
        <Modal title="Switch profile" onClose={() => setActiveModal(null)}>
          <SwitchProfileModalContent
            currentName={profileName}
            onSwitch={handleSwitchProfile}
            onClose={() => setActiveModal(null)}
          />
        </Modal>
      )}
    </div>
  )
}

export default App
