const PROFILES_KEY = 'finance-profiles-v1'
const ACTIVE_KEY = 'finance-active-profile'

export function readProfiles() {
  try {
    const raw = localStorage.getItem(PROFILES_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export function writeProfiles(map) {
  localStorage.setItem(PROFILES_KEY, JSON.stringify(map))
}

/** One-time migration from legacy single-user keys into named profiles. */
export function migrateLegacyToProfiles(initialTransactions) {
  let map = readProfiles()
  if (Object.keys(map).length > 0) return map

  const legacyTx = localStorage.getItem('finance-transactions')
  const legacyRole = localStorage.getItem('finance-role') || 'viewer'
  const defaultName = 'Alex Vance'
  map = {
    [defaultName]: {
      transactions: legacyTx ? JSON.parse(legacyTx) : initialTransactions,
      role: legacyRole,
    },
  }
  writeProfiles(map)
  localStorage.setItem(ACTIVE_KEY, defaultName)
  return map
}

export function getBootstrapState(initialTransactions) {
  const map = migrateLegacyToProfiles(initialTransactions)
  let active = (localStorage.getItem(ACTIVE_KEY) || 'Alex Vance').trim() || 'Alex Vance'

  if (!map[active]) {
    const keys = Object.keys(map)
    if (keys.length) {
      active = keys[0]
      localStorage.setItem(ACTIVE_KEY, active)
    } else {
      map[active] = { transactions: initialTransactions, role: 'viewer' }
      writeProfiles(map)
      localStorage.setItem(ACTIVE_KEY, active)
    }
  }

  const slot = normalizeProfileSlot(map[active])
  return {
    profileName: active,
    transactions: slot.transactions,
    role: slot.role,
  }
}

/** Deep-clone ledger so profiles never share the same array/object references. */
function cloneLedger(transactions) {
  try {
    return JSON.parse(JSON.stringify(Array.isArray(transactions) ? transactions : []))
  } catch {
    return []
  }
}

export function normalizeProfileSlot(slot) {
  if (!slot || !Array.isArray(slot.transactions)) {
    return { transactions: [], role: slot?.role || 'viewer' }
  }
  return { transactions: cloneLedger(slot.transactions), role: slot.role || 'viewer' }
}

export function persistProfileSlot(name, { transactions, role }) {
  const map = readProfiles()
  map[name] = { transactions: cloneLedger(transactions), role }
  writeProfiles(map)
}

export function setActiveProfileName(name) {
  localStorage.setItem(ACTIVE_KEY, name)
}

/** Names and counts for UI (e.g. profile picker). Sorted A→Z. */
export function getProfileSummaries() {
  const map = readProfiles()
  return Object.keys(map)
    .filter((name) => name && typeof name === 'string')
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    .map((name) => {
      const slot = map[name]
      const txs = slot?.transactions
      return {
        name,
        transactionCount: Array.isArray(txs) ? txs.length : 0,
        role: slot?.role || 'viewer',
      }
    })
}

export function profileInitials(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  const s = parts[0] || '?'
  return s.slice(0, 2).toUpperCase()
}
