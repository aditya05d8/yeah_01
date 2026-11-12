import { useState } from 'react'
import {
  X,
  MessageSquareText,
  Smartphone,
  Copy,
  Check,
  Bell,
  Clock,
} from 'lucide-react'
import {
  buildReminderMessage,
  formatTime12h,
  getDaysRemaining,
  isWithinReminderWindow,
} from '../utils/expiry'

export function WhatsAppPreviewModal({
  isOpen,
  onClose,
  products,
  settings,
  focusedProduct,
  onSendTestToast,
}) {
  const [channelView, setChannelView] = useState(
    settings.channel === 'sms' ? 'sms' : 'whatsapp'
  )
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const activeProducts = products.filter((p) => !p.used)
  const matching = activeProducts.filter((p) =>
    isWithinReminderWindow(p, settings.defaultLeadTimeDays)
  )
  const expired = activeProducts.filter(
    (p) => getDaysRemaining(p.expiryDate) < 0
  )

  // Determine which product(s) to preview
  const previewTargets = focusedProduct
    ? [focusedProduct]
    : matching.length > 0
    ? matching
    : activeProducts.slice(0, 2)

  const primaryProduct = previewTargets[0]
  const primaryDays = primaryProduct
    ? getDaysRemaining(primaryProduct.expiryDate)
    : 14

  const singleMessage = primaryProduct
    ? buildReminderMessage(primaryProduct, primaryDays)
    : `Reminder: Your Vitamin C Facial Serum expires in ${settings.defaultLeadTimeDays} days.`

  const fullTextMessage =
    previewTargets.length > 1
      ? `Hi ${settings.userName || 'there'}, Shelf Life Daily Check (${formatTime12h(
          settings.preferredTime
        )}):\n\n${previewTargets
          .map((item) => `• ${buildReminderMessage(item, getDaysRemaining(item.expiryDate))}`)
          .join('\n')}${
          expired.length > 0
            ? `\n\n⚠️ You also have ${expired.length} expired ${
                expired.length === 1 ? 'item' : 'items'
              } ready for disposal or restock.`
            : ''
        }`
      : `Hi ${settings.userName || 'there'}, ${singleMessage}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullTextMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard fallback ignored if blocked
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="wa-preview-title"
    >
      <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-700 text-white flex items-center justify-center">
              <MessageSquareText className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="wa-preview-title"
                className="text-lg font-bold text-[#0F172A]"
              >
                WhatsApp / SMS Alert Preview
              </h2>
              <p className="text-xs text-slate-600">
                Scheduled daily at {formatTime12h(settings.preferredTime)} •{' '}
                {settings.phoneNumber}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview modal"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#0F172A] hover:bg-slate-200/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Channel Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setChannelView('whatsapp')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  channelView === 'whatsapp'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                WhatsApp Preview
              </button>
              <button
                type="button"
                onClick={() => setChannelView('sms')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  channelView === 'sms'
                    ? 'bg-indigo-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                SMS Preview
              </button>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              Lead Rule: {settings.defaultLeadTimeDays} days
            </span>
          </div>

          {/* Simulated Phone Chat Frame */}
          <div className="rounded-2xl border border-slate-300 overflow-hidden shadow-inner">
            {/* Phone Top Bar */}
            <div
              className={`px-4 py-3 flex items-center justify-between text-white ${
                channelView === 'whatsapp' ? 'bg-emerald-800' : 'bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  SL
                </div>
                <div>
                  <p className="text-sm font-bold leading-tight">
                    Shelf Life Alerts
                  </p>
                  <p className="text-[11px] text-white/80">
                    {channelView === 'whatsapp'
                      ? 'Verified WhatsApp Bot'
                      : 'Automated SMS • +1 (800) 555-0199'}
                  </p>
                </div>
              </div>
              <Smartphone className="w-4 h-4 text-white/80" aria-hidden="true" />
            </div>

            {/* Chat Body */}
            <div
              className={`p-4 sm:p-5 space-y-3 min-h-[210px] ${
                channelView === 'whatsapp' ? 'bg-[#EFEAE2]' : 'bg-slate-100'
              }`}
            >
              <div className="text-center">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/80 text-[11px] font-semibold text-slate-600 shadow-2xs">
                  Today • {formatTime12h(settings.preferredTime)}
                </span>
              </div>

              <div
                className={`max-w-[92%] rounded-2xl rounded-tl-xs p-4 shadow-sm text-sm leading-relaxed whitespace-pre-line ${
                  channelView === 'whatsapp'
                    ? 'bg-white text-[#0F172A] border border-emerald-100'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {fullTextMessage}
                <div
                  className={`mt-2 text-[11px] text-right ${
                    channelView === 'whatsapp'
                      ? 'text-slate-400'
                      : 'text-indigo-200'
                  }`}
                >
                  {formatTime12h(settings.preferredTime)} ✓✓
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0F172A] transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-teal-700" aria-hidden="true" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" aria-hidden="true" />
                  Copy Message
                </>
              )}
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onSendTestToast(singleMessage, primaryProduct)
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold transition-colors"
              >
                <Bell className="w-4 h-4" aria-hidden="true" />
                Trigger In-App Toast
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

