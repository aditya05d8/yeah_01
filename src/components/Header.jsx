import {
  LayoutDashboard,
  ClipboardList,
  SlidersHorizontal,
  Bell,
  MessageSquareText,
  Plus,
  CalendarClock,
} from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inventory', label: 'Inventory', icon: ClipboardList },
  { id: 'settings', label: 'Alert Settings', icon: SlidersHorizontal },
]

export function Header({
  activeTab,
  onTabChange,
  alertCount,
  onOpenNotifications,
  onOpenPreview,
  onOpenAddModal,
}) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 py-3.5">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-sm">
              <CalendarClock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#0F172A] block leading-tight">
                Shelf Life
              </span>
              <span className="text-xs font-medium text-slate-500 block">
                Smart Expiry Date Tracker
              </span>
            </div>
          </div>

          {/* Primary Navigation (Desktop) */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 ${
                    isActive
                      ? 'bg-white text-teal-800 shadow-sm border border-slate-200/70'
                      : 'text-slate-600 hover:text-[#0F172A] hover:bg-white/60'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={onOpenNotifications}
              aria-label={`Open notification center (${alertCount} active alerts)`}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-[#0F172A] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              {alertCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-rose-600 text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                  {alertCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={onOpenPreview}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-indigo-200 bg-indigo-50/80 text-indigo-900 hover:bg-indigo-100/80 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600"
            >
              <MessageSquareText className="w-4 h-4 text-indigo-700" aria-hidden="true" />
              <span className="hidden sm:inline">Test Alert / WhatsApp Preview</span>
              <span className="sm:hidden">Test Alert</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-700"
            >
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav
          aria-label="Mobile Navigation"
          className="flex md:hidden items-center gap-1 pb-3 overflow-x-auto"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                {item.label}
              </button>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
