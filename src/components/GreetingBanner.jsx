import { useState } from 'react'
import { BellRing, Sparkles } from 'lucide-react'
import { formatTime12h, getGreetingPhrase } from '../utils/expiry'

export function GreetingBanner({
  userName,
  counts,
  reminderMatchesCount,
  defaultLeadTimeDays,
  preferredTime,
  onOpenSettings,
}) {
  const [greeting] = useState(() => getGreetingPhrase())
  const [todayLabel] = useState(() =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  )
  const needsAttention = counts.expired + counts.urgent

  return (
    <section
      aria-label="Daily Summary"
      className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{todayLabel}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0F172A]">
            {greeting}, {userName || 'Friend'}!
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
            {needsAttention > 0 ? (
              <>
                You have{' '}
                <span className="font-bold text-[#0F172A]">
                  {needsAttention} {needsAttention === 1 ? 'item' : 'items'}
                </span>{' '}
                needing immediate attention
                {counts.expired > 0 && (
                  <>
                    {' '}
                    ({counts.expired} expired
                    {counts.urgent > 0 ? `, ${counts.urgent} urgent` : ''})
                  </>
                )}
                {counts.expired === 0 && counts.urgent > 0 && (
                  <> ({counts.urgent} expiring within 7 days)</>
                )}
                , and{' '}
                <span className="font-semibold text-indigo-800">
                  {reminderMatchesCount}{' '}
                  {reminderMatchesCount === 1 ? 'item' : 'items'}
                </span>{' '}
                inside your active alert window.
              </>
            ) : (
              <>
                Everything looks great! No expired or urgent items right now.{' '}
                <span className="font-semibold text-teal-800">
                  {reminderMatchesCount}{' '}
                  {reminderMatchesCount === 1 ? 'item' : 'items'}
                </span>{' '}
                are currently within your alert window.
              </>
            )}
          </p>
        </div>

        {/* Active Rule Pill */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 shrink-0">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
            <BellRing className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Active Reminder Engine
            </p>
            <p className="text-sm font-bold text-[#0F172A]">
              {defaultLeadTimeDays} days before • {formatTime12h(preferredTime)}
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="sm:ml-2 text-xs font-semibold text-teal-800 hover:text-teal-900 bg-white hover:bg-teal-50 border border-slate-200 px-3 py-1.5 rounded-lg transition-colors"
          >
            Change Rule
          </button>
        </div>
      </div>
    </section>
  )
}
