import { X, BellRing, MessageSquareText, CheckCircle2 } from 'lucide-react'

export function ToastContainer({ toasts, onDismiss, onOpenPreview }) {
  if (!toasts || toasts.length === 0) return null

  return (
    <div
      aria-live="polite"
      aria-label="In-app notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 w-[calc(100%-2rem)] max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => {
        const isSuccess = toast.variant === 'success'
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-2xl border shadow-lg p-4 animate-slide-up flex items-start gap-3 ${
              isSuccess
                ? 'bg-white border-teal-300'
                : 'bg-white border-indigo-300'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isSuccess
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-indigo-100 text-indigo-800'
              }`}
            >
              {isSuccess ? (
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
              ) : (
                <BellRing className="w-5 h-5" aria-hidden="true" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                {toast.title || 'Shelf Life Alert'}
              </p>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5 leading-snug">
                {toast.message}
              </p>
              {toast.product && (
                <button
                  type="button"
                  onClick={() => onOpenPreview(toast.product)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-900"
                >
                  <MessageSquareText className="w-3.5 h-3.5" aria-hidden="true" />
                  View WhatsApp / SMS Preview
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

