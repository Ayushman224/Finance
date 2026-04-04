# Interview prep — Finance dashboard

Quick answers you can say out loud.

## Why Vite instead of Create React App?

CRA is largely unmaintained for new projects. Vite uses native ESM in dev, starts instantly, and outputs a modern Rollup-based production build. Good fit for a static SPA.

## Why Tailwind?

Predictable spacing, responsive utilities, no context-switching between CSS files and JSX for layout. Trade-off: class strings can get long; we keep components small.

## Why Recharts over Chart.js / D3?

Recharts is React-first (components as children), handles responsiveness with `ResponsiveContainer`, and is enough for line + pie dashboards without hand-writing scales. D3 is more flexible but more code; Chart.js is canvas-focused and less idiomatic in React tree form.

## How does the CSV export work without a server?

The browser builds a string, wraps it in a `Blob`, creates an object URL, triggers a programmatic download on a hidden anchor, then revokes the URL. No network—pure client. Excel opens CSV directly.

## Why UTF-8 BOM?

Excel on Windows often assumes a legacy encoding for CSV without BOM. The BOM hints UTF-8 so currency symbols and non-ASCII text render correctly.

## How do you keep the table and export in sync?

Both read the same `filteredTransactions` from `useDashboardDerived`—single source of truth after filters/sort.

## Why parseIsoDateLocal?

`new Date("YYYY-MM-DD")` is parsed as UTC midnight. In US timezones that becomes the previous local day/month. Splitting the string and using `new Date(y, m-1, d)` anchors the calendar day in local time.

## Why useMemo in a custom hook?

Recomputing aggregates on every render would waste work. `useMemo` recomputes only when `transactions` or filter inputs change—classic React optimization for derived state.

## What would you add in production?

Real API + auth (JWT or session), server-side RBAC, validation (e.g. Zod), error boundaries, E2E tests (Playwright), accessibility audit, and possibly TanStack Query for caching server state.
