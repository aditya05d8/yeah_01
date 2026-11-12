export const STORAGE_KEYS = {
  PRODUCTS: 'freshguard_products_v1',
  SETTINGS: 'freshguard_settings_v1',
}

export const CATEGORIES = [
  'Groceries',
  'Medicine',
  'Cosmetics',
  'Household',
  'Other',
]

export const CATEGORY_STYLES = {
  Groceries: {
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconBg: 'bg-emerald-100 text-emerald-700',
  },
  Medicine: {
    badge: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    iconBg: 'bg-indigo-100 text-indigo-700',
  },
  Cosmetics: {
    badge: 'bg-teal-50 text-teal-800 border-teal-200',
    iconBg: 'bg-teal-100 text-teal-700',
  },
  Household: {
    badge: 'bg-slate-100 text-slate-800 border-slate-300',
    iconBg: 'bg-slate-200 text-slate-700',
  },
  Other: {
    badge: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    iconBg: 'bg-zinc-200 text-zinc-700',
  },
}

// High-contrast, colorblind-safe semantic status metadata
export const STATUS_META = {
  urgent: {
    key: 'urgent',
    label: 'Urgent',
    rangeLabel: '0–7 days',
    description: 'Use or prioritize right away',
    cardBg: 'bg-rose-50/85 hover:bg-rose-50',
    cardBorder: 'border-rose-200',
    activeRing: 'ring-2 ring-rose-600 border-rose-500 bg-rose-50',
    iconBox: 'bg-rose-100 text-rose-800 border border-rose-200',
    badge: 'bg-rose-100 text-rose-900 border border-rose-300',
    countColor: 'text-rose-900',
    barFill: 'bg-rose-600',
    barTrack: 'bg-rose-100',
  },
  soon: {
    key: 'soon',
    label: 'Soon',
    rangeLabel: '8–15 days',
    description: 'Plan to use within two weeks',
    cardBg: 'bg-amber-50/85 hover:bg-amber-50',
    cardBorder: 'border-amber-200',
    activeRing: 'ring-2 ring-amber-600 border-amber-500 bg-amber-50',
    iconBox: 'bg-amber-100 text-amber-900 border border-amber-200',
    badge: 'bg-amber-100 text-amber-950 border border-amber-300',
    countColor: 'text-amber-950',
    barFill: 'bg-amber-600',
    barTrack: 'bg-amber-100',
  },
  watch: {
    key: 'watch',
    label: 'Watch',
    rangeLabel: '16–30 days',
    description: 'Keep on your monthly radar',
    cardBg: 'bg-sky-50/85 hover:bg-sky-50',
    cardBorder: 'border-sky-200',
    activeRing: 'ring-2 ring-teal-700 border-teal-500 bg-sky-50',
    iconBox: 'bg-sky-100 text-sky-900 border border-sky-200',
    badge: 'bg-sky-100 text-sky-900 border border-sky-300',
    countColor: 'text-sky-950',
    barFill: 'bg-teal-600',
    barTrack: 'bg-sky-100',
  },
  expired: {
    key: 'expired',
    label: 'Expired',
    rangeLabel: 'Past due',
    description: 'Safely dispose or restock',
    cardBg: 'bg-violet-50/80 hover:bg-violet-50',
    cardBorder: 'border-violet-200',
    activeRing: 'ring-2 ring-violet-700 border-violet-500 bg-violet-50',
    iconBox: 'bg-violet-100 text-violet-900 border border-violet-200',
    badge: 'bg-violet-100 text-violet-950 border border-violet-300',
    countColor: 'text-violet-950',
    barFill: 'bg-violet-700',
    barTrack: 'bg-violet-100',
  },
  safe: {
    key: 'safe',
    label: 'Fresh',
    rangeLabel: '31+ days',
    description: 'Well within shelf life',
    cardBg: 'bg-white',
    cardBorder: 'border-slate-200',
    activeRing: 'ring-2 ring-teal-700 border-teal-500',
    iconBox: 'bg-teal-50 text-teal-800 border border-teal-200',
    badge: 'bg-slate-100 text-slate-800 border border-slate-300',
    countColor: 'text-slate-900',
    barFill: 'bg-teal-600',
    barTrack: 'bg-slate-100',
  },
}

export const DEFAULT_SETTINGS = {
  userName: 'Alex',
  defaultLeadTimeDays: 14,
  preferredTime: '09:00',
  channel: 'whatsapp', // 'whatsapp' | 'sms' | 'both'
  phoneNumber: '+1 (555) 234-8910',
  autoShowToastOnLoad: true,
}

/**
 * Returns local calendar Date at 00:00:00 from a YYYY-MM-DD string.
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return new Date()
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, (month || 1) - 1, day || 1)
}

/**
 * Formats a Date object as YYYY-MM-DD in local time.
 */
export function toLocalDateInput(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Returns YYYY-MM-DD offset by N days from today.
 */
export function getDateOffsetFromToday(offsetDays) {
  const now = new Date()
  const target = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offsetDays)
  return toLocalDateInput(target)
}

/**
 * Exact integer calendar days from today (negative = expired).
 */
export function getDaysRemaining(expiryDateStr) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const expiry = parseLocalDate(expiryDateStr)
  const msPerDay = 1000 * 60 * 60 * 24
  return Math.round((expiry.getTime() - today.getTime()) / msPerDay)
}

export function getExpiryStatus(daysRemaining) {
  if (daysRemaining < 0) return 'expired'
  if (daysRemaining <= 7) return 'urgent'
  if (daysRemaining <= 15) return 'soon'
  if (daysRemaining <= 30) return 'watch'
  return 'safe'
}

export function formatDisplayDate(dateStr) {
  const date = parseLocalDate(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime12h(time24) {
  if (!time24 || !time24.includes(':')) return '9:00 AM'
  const [hStr, mStr] = time24.split(':')
  let h = parseInt(hStr, 10)
  const suffix = h >= 12 ? 'PM' : 'AM'
  h = h % 12 || 12
  return `${h}:${mStr} ${suffix}`
}

export function formatDaysRemainingText(days) {
  if (days < -1) return `Expired ${Math.abs(days)} days ago`
  if (days === -1) return 'Expired yesterday'
  if (days === 0) return 'Expires today'
  if (days === 1) return '1 day left'
  return `${days} days left`
}

export function getGreetingPhrase() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function getEffectiveLeadTime(product, globalLeadTimeDays) {
  if (
    product.customLeadTime !== null &&
    product.customLeadTime !== undefined &&
    product.customLeadTime !== ''
  ) {
    const parsed = Number(product.customLeadTime)
    if (!Number.isNaN(parsed) && parsed >= 0) return parsed
  }
  return Number(globalLeadTimeDays) || 14
}

/**
 * Determines whether an active product should trigger a reminder under the active lead-time engine.
 */
export function isWithinReminderWindow(product, globalLeadTimeDays) {
  if (product.used) return false
  const days = getDaysRemaining(product.expiryDate)
  const lead = getEffectiveLeadTime(product, globalLeadTimeDays)
  return days >= 0 && days <= lead
}

export function buildReminderMessage(product, daysRemaining) {
  const formattedDate = formatDisplayDate(product.expiryDate)
  if (daysRemaining < 0) {
    const past = Math.abs(daysRemaining)
    return `Action Needed: Your ${product.name} expired ${past} ${past === 1 ? 'day' : 'days'} ago on ${formattedDate}. Please safely dispose of it or restock.`
  }
  if (daysRemaining === 0) {
    return `Reminder: Your ${product.name} expires today (${formattedDate}). Use it soon to avoid waste!`
  }
  if (daysRemaining === 1) {
    return `Reminder: Your ${product.name} expires in 1 day on ${formattedDate}.`
  }
  return `Reminder: Your ${product.name} expires in ${daysRemaining} days on ${formattedDate}.`
}

export function getProgressPercent(daysRemaining) {
  // Visual urgency gauge across a 30-day horizon (100% = expired or 0 days left)
  if (daysRemaining <= 0) return 100
  if (daysRemaining >= 30) return 12
  return Math.max(12, Math.min(100, Math.round(((30 - daysRemaining) / 30) * 100)))
}

export function getInitialProducts() {
  return [
    {
      id: 'sample-milk-expired',
      name: 'Organic Whole Milk (1L)',
      category: 'Groceries',
      expiryDate: getDateOffsetFromToday(-3),
      customLeadTime: null,
      notes: 'Refrigerator top shelf',
      used: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-spinach-urgent',
      name: 'Fresh Baby Spinach',
      category: 'Groceries',
      expiryDate: getDateOffsetFromToday(3),
      customLeadTime: 5,
      notes: 'Crisper drawer',
      used: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-medicine-urgent',
      name: 'Children’s Fever Suspension',
      category: 'Medicine',
      expiryDate: getDateOffsetFromToday(6),
      customLeadTime: null,
      notes: 'Medicine cabinet • Check seal',
      used: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-serum-14d',
      name: 'Vitamin C Facial Serum',
      category: 'Cosmetics',
      expiryDate: getDateOffsetFromToday(14),
      customLeadTime: null,
      notes: '14-day mark demo item • Vanity shelf',
      used: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-pods-watch',
      name: 'Eco Dishwashing Pods',
      category: 'Household',
      expiryDate: getDateOffsetFromToday(23),
      customLeadTime: null,
      notes: 'Under kitchen sink',
      used: false,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'sample-almond-safe',
      name: 'Roasted Almond Butter',
      category: 'Groceries',
      expiryDate: getDateOffsetFromToday(42),
      customLeadTime: 21,
      notes: 'Pantry jar',
      used: false,
      createdAt: new Date().toISOString(),
    },
  ]
}

