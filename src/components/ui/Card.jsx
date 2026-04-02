export const cardClass =
  'rounded-2xl border border-slate-200 bg-white p-5 shadow-sm'

export function Card({ children, className = '' }) {
  return <div className={`${cardClass} ${className}`.trim()}>{children}</div>
}
