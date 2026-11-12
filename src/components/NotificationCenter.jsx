import { X, BellRing, MessageSquareText, Send, ShieldAlert, Clock } from 'lucide-react'
import {
  buildReminderMessage,
  formatDisplayDate,
  formatTime12h,
  getDaysRemaining,
  getEffectiveLeadTime,
  isWithinReminderWindow,
} from '../utils/expiry'

export function NotificationCenter({
  isOpen,
  onClose,
  products,
  settings,
  onSimulateToasts,
  onOpenPreviewForProduct,
}) {
  if (!isOpen) return null

  const activeProducts = products.filter((p) => !p.used)
  const upcomingAlerts = activeProducts
    .filter((p) => isWithinReminderWindow(p, settings.defaultLeadTimeDays))
    .sort(
      (a, b) =>
        getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate)
    )

  const expiredAlerts = activeProducts
    .filter((p) => getDaysRemaining(p.expiryDate) < 0)
    .sort(
      (a, b) =>
        getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate)
    )

  const totalCount = upcomingAlerts.length + expiredAlerts.length

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-center-title"
    >
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center">
              <BellRing className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="notif-center-title"
                className="text-base font-bold text-[#0F172A]"
              >
                Notification Center
              </h2>
              <p className="text-xs text-slate-600">
                {totalCount} active {totalCount === 1 ? 'reminder' : 'reminders'} •{' '}
                {settings.defaultLeadTimeDays}d rule
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close notification center"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#0F172A] hover:bg-slate-200/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule Bar */}
        <div className="px-6 py-3 bg-indigo-50/70 border-b border-indigo-100 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-900">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            Daily check at {formatTime12h(settings.preferredTime)}
          </span>
          <button
            type="button"
            onClick={onSimulateToasts}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold transition-colors"
          >
            <Send className="w-3 h-3" aria-hidden="true" />
            Simulate Daily Alerts
          </button>
        </div>

        {/* Scrollable Alerts List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {totalCount === 0 ? (
            <div className="text-center py-12 px-4">
              <BellRing
                className="w-10 h-10 text-slate-300 mx-auto mb-3"
                aria-hidden="true"
              />
              <p className="text-sm font-bold text-[#0F172A]">
                All caught up!
              </p>
              <p className="text-xs text-slate-500 mt-1">
                No products are currently inside your{' '}
                {settings.defaultLeadTimeDays}-day alert window or past due.
              </p>
            </div>
          ) : (
            <>
              {expiredAlerts.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-violet-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
                    Past-Due Alerts ({expiredAlerts.length})
                  </h3>
                  {expiredAlerts.map((item) => {
                    const days = getDaysRemaining(item.expiryDate)
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-violet-200 bg-violet-50/70 p-4 space-y-2"
                      >
                        <p className="text-sm font-semibold text-[#0F172A]">
                          {buildReminderMessage(item, days)}
                        </p>
                        <div className="flex items-center justify-between text-xs text-violet-900">
                          <span>Expired {formatDisplayDate(item.expiryDate)}</span>
                          <button
                            type="button"
                            onClick={() => onOpenPreviewForProduct(item)}
                            className="inline-flex items-center gap-1 font-bold text-indigo-800 hover:underline"
                          >
                            <MessageSquareText className="w-3.5 h-3.5" />
                            Preview SMS/WA
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {upcomingAlerts.length > 0 && (
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                    <BellRing className="w-3.5 h-3.5" aria-hidden="true" />
                    Upcoming Reminder Window ({upcomingAlerts.length})
                  </h3>
                  {upcomingAlerts.map((item) => {
                    const days = getDaysRemaining(item.expiryDate)
                    const lead = getEffectiveLeadTime(
                      item,
                      settings.defaultLeadTimeDays
                    )
                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-full">
                            {lead}-day lead rule
                          </span>
                          <span className="text-xs text-slate-500">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-[#0F172A]">
                          {buildReminderMessage(item, days)}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-600">
                          <span>Due {formatDisplayDate(item.expiryDate)}</span>
                          <button
                            type="button"
                            onClick={() => onOpenPreviewForProduct(item)}
                            className="inline-flex items-center gap-1 font-bold text-teal-800 hover:underline"
                          >
                            <MessageSquareText className="w-3.5 h-3.5" />
                            WhatsApp Preview
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

