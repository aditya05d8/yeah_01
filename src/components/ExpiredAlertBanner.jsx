import { ShieldAlert, Trash2, RefreshCw } from 'lucide-react'
import { formatDaysRemainingText, formatDisplayDate, getDaysRemaining } from '../utils/expiry'

export function ExpiredAlertBanner({
  expiredProducts,
  onDispose,
  onRestock,
  onFilterExpired,
}) {
  if (!expiredProducts || expiredProducts.length === 0) return null

  return (
    <section
      role="region"
      aria-label="Expired Items Action Required"
      className="rounded-2xl border-2 border-violet-300 bg-violet-50/90 p-5 shadow-xs"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-violet-200/80 text-violet-950 border border-violet-300 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldAlert className="w-6 h-6" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-violet-950">
                {expiredProducts.length}{' '}
                {expiredProducts.length === 1
                  ? 'Expired Product Requires Attention'
                  : 'Expired Products Require Attention'}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-violet-200 text-violet-950">
                Past Due
              </span>
            </div>
            <p className="text-sm text-violet-900 mt-1 max-w-2xl">
              These items have passed their expiry date. For safety and freshness,
              please safely dispose of them or restock with a new expiry date.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onFilterExpired}
          className="self-start text-xs font-bold text-violet-950 bg-white hover:bg-violet-100 border border-violet-300 px-3.5 py-2 rounded-xl transition-colors shrink-0"
        >
          Filter Expired in List
        </button>
      </div>

      {/* Actionable Expired Items Strip */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {expiredProducts.map((item) => {
          const days = getDaysRemaining(item.expiryDate)
          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-xl border border-violet-200 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0F172A] truncate">
                  {item.name}
                </p>
                <p className="text-xs font-medium text-violet-900 mt-0.5">
                  {formatDaysRemainingText(days)} • {formatDisplayDate(item.expiryDate)} •{' '}
                  {item.category}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onRestock(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                  Restock
                </button>
                <button
                  type="button"
                  onClick={() => onDispose(item)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-100 hover:bg-violet-200 text-violet-950 border border-violet-300 text-xs font-semibold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                  Safely Dispose
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

