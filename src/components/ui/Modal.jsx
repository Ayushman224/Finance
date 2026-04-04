import { useEffect } from 'react'

export function Modal({ title, children, onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[min(90vh,640px)] w-full max-w-lg overflow-y-auto rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-[0_0_60px_-12px_rgba(168,85,247,0.35)]">
        <div className="flex items-start justify-between gap-3">
          <h2 id="modal-title" className="text-lg font-semibold text-zinc-100">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-xl leading-none text-zinc-500 hover:bg-white/10 hover:text-zinc-200"
          >
            ×
          </button>
        </div>
        <div className="mt-4 text-sm text-zinc-400">{children}</div>
      </div>
    </div>
  )
}
