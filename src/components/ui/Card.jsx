/** Glass-style panel for dark neon theme */
export const cardClass =
  'rounded-2xl border border-white/10 bg-zinc-900/50 p-5 shadow-[0_0_48px_-16px_rgba(168,85,247,0.25)] backdrop-blur-md'

export const glowBtnClass =
  'rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(139,92,246,0.45)] transition hover:shadow-[0_0_36px_rgba(59,130,246,0.4)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none'

export function Card({ children, className = '' }) {
  return <div className={`${cardClass} ${className}`.trim()}>{children}</div>
}
