import {
  BellRing,
  Clock,
  MessageSquareText,
  RotateCcw,
  CheckCircle2,
  User,
  Send,
} from 'lucide-react'
import {
  formatDaysRemainingText,
  formatDisplayDate,
  formatTime12h,
  getDaysRemaining,
  getEffectiveLeadTime,
  isWithinReminderWindow,
} from '../utils/expiry'

const LEAD_TIME_PRESETS = [
  { days: 3, label: '3 Days Before', hint: 'Last-minute nudge' },
  { days: 7, label: '1 Week (7 Days)', hint: 'Weekly planner' },
  { days: 14, label: '2 Weeks (14 Days)', hint: 'Recommended default' },
  { days: 30, label: '1 Month (30 Days)', hint: 'Early restock window' },
]

const TIME_PRESETS = ['08:00', '09:00', '12:00', '18:00']

export function AlertSettingsPanel({
  settings,
  onUpdateSettings,
  products,
  onTriggerTestToast,
  onOpenWhatsAppPreview,
  onResetDemoData,
}) {
  const activeProducts = products.filter((p) => !p.used)
  const matchingProducts = activeProducts.filter((p) =>
    isWithinReminderWindow(p, settings.defaultLeadTimeDays)
  )
  const expiredProducts = activeProducts.filter(
    (p) => getDaysRemaining(p.expiryDate) < 0
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 cols: Preferences Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Reminder Lead Time Card */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 border border-teal-200 flex items-center justify-center shrink-0">
                <BellRing className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Customizable Alert Lead-Time Engine
                </h2>
                <p className="text-sm text-slate-600">
                  Choose how many days before expiry you want Shelf Life to start
                  sending reminders.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LEAD_TIME_PRESETS.map((preset) => {
              const isSelected =
                Number(settings.defaultLeadTimeDays) === preset.days
              return (
                <button
                  key={preset.days}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({ defaultLeadTimeDays: preset.days })
                  }
                  className={`text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-teal-700 bg-teal-50/70 ring-2 ring-teal-700/20'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#0F172A]">
                      {preset.label}
                    </span>
                    {isSelected && (
                      <CheckCircle2
                        className="w-4 h-4 text-teal-700"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <span className="text-xs text-slate-600 mt-1 block">
                    {preset.hint}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Custom Days Input */}
          <div className="flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <label
              htmlFor="global-custom-days"
              className="text-sm font-semibold text-[#0F172A]"
            >
              Or enter custom lead time:
            </label>
            <div className="flex items-center gap-2">
              <input
                id="global-custom-days"
                type="number"
                min="1"
                max="180"
                value={settings.defaultLeadTimeDays}
                onChange={(e) => {
                  const val = Math.max(
                    1,
                    Math.min(180, Number(e.target.value) || 1)
                  )
                  onUpdateSettings({ defaultLeadTimeDays: val })
                }}
                className="w-24 px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <span className="text-sm font-medium text-slate-600">
                days before expiry
              </span>
            </div>
          </div>
        </section>

        {/* Preferred Time & Channel Card */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#0F172A]">
                Delivery Schedule & Profile
              </h2>
              <p className="text-sm text-slate-600">
                Set your preferred daily alert time, messaging channel, and
                display name.
              </p>
            </div>
          </div>

          {/* Preferred Time */}
          <div className="space-y-2.5">
            <label className="block text-sm font-semibold text-[#0F172A]">
              Preferred Time of Day
            </label>
            <div className="flex flex-wrap items-center gap-2.5">
              {TIME_PRESETS.map((t) => {
                const active = settings.preferredTime === t
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onUpdateSettings({ preferredTime: t })}
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                      active
                        ? 'bg-indigo-700 text-white border-indigo-700'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {formatTime12h(t)}
                  </button>
                )
              })}
              <div className="flex items-center gap-2 ml-auto">
                <label
                  htmlFor="custom-alert-time"
                  className="text-xs font-semibold text-slate-600"
                >
                  Custom time:
                </label>
                <input
                  id="custom-alert-time"
                  type="time"
                  value={settings.preferredTime}
                  onChange={(e) =>
                    onUpdateSettings({ preferredTime: e.target.value })
                  }
                  className="px-3 py-2 rounded-xl border border-slate-300 bg-white text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Channel + Name + Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label
                htmlFor="settings-name"
                className="block text-sm font-semibold text-[#0F172A] mb-1.5"
              >
                Your Name
              </label>
              <div className="relative">
                <User
                  className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"
                  aria-hidden="true"
                />
                <input
                  id="settings-name"
                  type="text"
                  value={settings.userName}
                  onChange={(e) =>
                    onUpdateSettings({ userName: e.target.value })
                  }
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="settings-channel"
                className="block text-sm font-semibold text-[#0F172A] mb-1.5"
              >
                Alert Channel
              </label>
              <select
                id="settings-channel"
                value={settings.channel}
                onChange={(e) =>
                  onUpdateSettings({ channel: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS Text Message</option>
                <option value="both">WhatsApp + SMS</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="settings-phone"
                className="block text-sm font-semibold text-[#0F172A] mb-1.5"
              >
                Recipient Number
              </label>
              <input
                id="settings-phone"
                type="tel"
                value={settings.phoneNumber}
                onChange={(e) =>
                  onUpdateSettings({ phoneNumber: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={onTriggerTestToast}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold transition-colors"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                Simulate Alert Toast Now
              </button>
              <button
                type="button"
                onClick={onOpenWhatsAppPreview}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-sm font-semibold transition-colors"
              >
                <MessageSquareText className="w-4 h-4" aria-hidden="true" />
                Open WhatsApp / SMS Preview
              </button>
            </div>

            <button
              type="button"
              onClick={onResetDemoData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              Reset Demo Data
            </button>
          </div>
        </section>
      </div>

      {/* Right Column: Live Rule Evaluation */}
      <aside className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-5">
        <div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
            Live Rule Preview
          </span>
          <h3 className="text-lg font-bold text-[#0F172A] mt-3">
            Items Triggering Reminders ({matchingProducts.length})
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            With your{' '}
            <strong className="text-[#0F172A]">
              {settings.defaultLeadTimeDays}-day
            </strong>{' '}
            rule (plus any per-item overrides), these active items are inside the
            notification window right now:
          </p>

          <ul className="mt-4 space-y-2.5">
            {matchingProducts.length === 0 ? (
              <li className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                No upcoming items match a {settings.defaultLeadTimeDays}-day
                window. Try increasing to 14 or 30 days to see upcoming alerts.
              </li>
            ) : (
              matchingProducts.map((item) => {
                const days = getDaysRemaining(item.expiryDate)
                const lead = getEffectiveLeadTime(
                  item,
                  settings.defaultLeadTimeDays
                )
                return (
                  <li
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#0F172A] truncate">
                        {item.name}
                      </span>
                      <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded-full shrink-0">
                        {lead}d rule
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      {formatDaysRemainingText(days)} •{' '}
                      {formatDisplayDate(item.expiryDate)}
                    </p>
                  </li>
                )
              })
            )}
          </ul>

          {expiredProducts.length > 0 && (
            <div className="mt-4 rounded-xl border border-violet-200 bg-violet-50 p-3.5">
              <p className="text-xs font-bold text-violet-950">
                + {expiredProducts.length} Past-Due{' '}
                {expiredProducts.length === 1 ? 'Item' : 'Items'}
              </p>
              <p className="text-xs text-violet-900 mt-0.5">
                Expired items also generate urgent disposal/restock reminders.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-teal-50/80 border border-teal-200 p-4 text-xs text-teal-950 leading-relaxed">
          <strong>Tip:</strong> Switch between <strong>14 days</strong> and{' '}
          <strong>7 days</strong> above to watch <em>Vitamin C Facial Serum</em>{' '}
          (at the 14-day mark) enter or leave your reminder queue in real time.
        </div>
      </aside>
    </div>
  )
}

