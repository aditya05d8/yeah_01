import { Filter } from 'lucide-react'
import { STATUS_META } from '../utils/expiry'
import { StatusIcon } from './CategoryIcon'

const CARD_ORDER = ['urgent', 'soon', 'watch', 'expired']

export function StatusOverviewCards({ counts, selectedStatus, onSelectStatus }) {
  return (
    <section aria-label="Expiry Status Overview">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-[#0F172A] tracking-tight">
          Expiry Overview
        </h2>
        {selectedStatus !== 'all' && (
          <button
            type="button"
            onClick={() => onSelectStatus('all')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-800 hover:text-teal-950 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full transition-colors"
          >
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            Showing: {STATUS_META[selectedStatus]?.label || selectedStatus} • Clear filter
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {CARD_ORDER.map((statusKey) => {
          const meta = STATUS_META[statusKey]
          const count = counts[statusKey] || 0
          const isSelected = selectedStatus === statusKey

          return (
            <button
              key={statusKey}
              type="button"
              onClick={() => onSelectStatus(isSelected ? 'all' : statusKey)}
              aria-pressed={isSelected}
              className={`text-left rounded-2xl border p-5 transition-all shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 ${
                isSelected ? meta.activeRing : `${meta.cardBg} ${meta.cardBorder}`
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${meta.badge}`}
                  >
                    {meta.label}
                  </span>
                  <p className="mt-1.5 text-xs font-semibold text-slate-600">
                    {meta.rangeLabel}
                  </p>
                </div>

                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${meta.iconBox}`}
                >
                  <StatusIcon status={statusKey} className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span
                  className={`text-4xl font-extrabold tabular-nums tracking-tight ${meta.countColor}`}
                >
                  {count}
                </span>
                <span className="text-xs font-semibold text-slate-600">
                  {isSelected ? 'Filtered • Click to reset' : 'Click to filter'}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-600 font-medium">
                {meta.description}
              </p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

