import {
  Search,
  Check,
  Pencil,
  Trash2,
  Bell,
  MessageSquareText,
  RotateCcw,
  Plus,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import {
  CATEGORIES,
  CATEGORY_STYLES,
  STATUS_META,
  formatDaysRemainingText,
  formatDisplayDate,
  getDaysRemaining,
  getEffectiveLeadTime,
  getExpiryStatus,
  getProgressPercent,
  isWithinReminderWindow,
} from '../utils/expiry'
import { CategoryIcon, StatusIcon } from './CategoryIcon'

export function ProductList({
  products,
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
  sortBy,
  onSortChange,
  showUsed,
  onToggleShowUsed,
  defaultLeadTimeDays,
  onMarkUsed,
  onRestoreUsed,
  onEdit,
  onDelete,
  onPreviewProductAlert,
  onOpenAddModal,
}) {
  const activeCount = products.filter((p) => !p.used).length
  const usedCount = products.filter((p) => p.used).length

  const filteredProducts = products
    .filter((item) => {
      if (showUsed) return item.used
      if (item.used) return false

      const days = getDaysRemaining(item.expiryDate)
      const status = getExpiryStatus(days)

      if (selectedStatus !== 'all' && status !== selectedStatus) return false
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false
      }

      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim()
        const matchName = item.name.toLowerCase().includes(q)
        const matchCategory = item.category.toLowerCase().includes(q)
        const matchNotes = (item.notes || '').toLowerCase().includes(q)
        if (!matchName && !matchCategory && !matchNotes) return false
      }
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'category') {
        return (
          a.category.localeCompare(b.category) ||
          getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate)
        )
      }
      return getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate)
    })

  const hasFilters =
    searchQuery.trim() !== '' ||
    selectedCategory !== 'All' ||
    selectedStatus !== 'all'

  return (
    <section
      aria-label="Product Inventory List"
      className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden"
    >
      {/* Toolbar Header */}
      <div className="p-5 sm:p-6 border-b border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] tracking-tight">
              {showUsed ? 'Used & Completed Items' : 'Tracked Products'}
            </h2>
            <p className="text-sm text-slate-600 mt-0.5">
              {showUsed
                ? `${usedCount} ${usedCount === 1 ? 'item' : 'items'} marked as used`
                : `Showing ${filteredProducts.length} of ${activeCount} active ${
                    activeCount === 1 ? 'product' : 'products'
                  }`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Active vs Used Toggle */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => onToggleShowUsed(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  !showUsed
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                Active ({activeCount})
              </button>
              <button
                type="button"
                onClick={() => onToggleShowUsed(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  showUsed
                    ? 'bg-white text-[#0F172A] shadow-xs'
                    : 'text-slate-600 hover:text-[#0F172A]'
                }`}
              >
                Used ({usedCount})
              </button>
            </div>
          </div>
        </div>

        {/* Search + Filter Controls */}
        {!showUsed && (
          <div className="flex flex-col lg:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search
                className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search by product name, category, or storage note..."
                aria-label="Search products"
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 bg-slate-50/50 text-sm text-[#0F172A] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category & Status & Sort */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
              <select
                value={selectedCategory}
                onChange={(e) => onCategoryChange(e.target.value)}
                aria-label="Filter by category"
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                aria-label="Filter by expiry status"
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="all">All Statuses</option>
                <option value="urgent">Urgent (0–7 days)</option>
                <option value="soon">Soon (8–15 days)</option>
                <option value="watch">Watch (16–30 days)</option>
                <option value="expired">Expired (Past due)</option>
                <option value="safe">Fresh (31+ days)</option>
              </select>

              <div className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-300 bg-white">
                <SlidersHorizontal
                  className="w-4 h-4 text-slate-500"
                  aria-hidden="true"
                />
                <select
                  value={sortBy}
                  onChange={(e) => onSortChange(e.target.value)}
                  aria-label="Sort products"
                  className="bg-transparent text-sm font-medium text-[#0F172A] focus:outline-none"
                >
                  <option value="expiry">Soonest Expiring</option>
                  <option value="name">Name (A–Z)</option>
                  <option value="category">Category</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" aria-hidden="true" />
          </div>
          <h3 className="text-base font-bold text-[#0F172A]">
            {showUsed
              ? 'No used products yet'
              : hasFilters
              ? 'No products match your current filters'
              : 'Your inventory is empty'}
          </h3>
          <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
            {showUsed
              ? 'When you mark an item as used, it moves here for your records.'
              : hasFilters
              ? 'Try clearing your search or switching the status filter.'
              : 'Add groceries, medicine, cosmetics, or household items to start tracking expiry dates.'}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2">
            {!showUsed && hasFilters && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('')
                  onCategoryChange('All')
                  onStatusChange('all')
                }}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-[#0F172A]"
              >
                Reset Filters
              </button>
            )}
            {!showUsed && !hasFilters && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold"
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                Add First Product
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Product Rows */
        <ul className="divide-y divide-slate-200">
          {filteredProducts.map((product) => {
            const days = getDaysRemaining(product.expiryDate)
            const statusKey = getExpiryStatus(days)
            const meta = STATUS_META[statusKey]
            const catStyle =
              CATEGORY_STYLES[product.category] || CATEGORY_STYLES.Other
            const effectiveLead = getEffectiveLeadTime(
              product,
              defaultLeadTimeDays
            )
            const inAlertWindow = isWithinReminderWindow(
              product,
              defaultLeadTimeDays
            )
            const progressPct = getProgressPercent(days)
            const hasCustomLead =
              product.customLeadTime !== null &&
              product.customLeadTime !== undefined &&
              product.customLeadTime !== ''

            return (
              <li
                key={product.id}
                className={`p-5 sm:px-6 transition-colors ${
                  !showUsed && statusKey === 'expired'
                    ? 'bg-violet-50/40 hover:bg-violet-50/70'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Product Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${catStyle.iconBg}`}
                    >
                      <CategoryIcon
                        category={product.category}
                        className="w-5 h-5"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-[#0F172A] truncate">
                          {product.name}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${catStyle.badge}`}
                        >
                          {product.category}
                        </span>
                        {!showUsed && inAlertWindow && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-800 border border-indigo-200">
                            <Bell className="w-3 h-3" aria-hidden="true" />
                            Alert Active ({effectiveLead}d rule)
                          </span>
                        )}
                        {!showUsed && !inAlertWindow && hasCustomLead && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            Custom lead: {effectiveLead}d
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600">
                        <span>
                          Expires:{' '}
                          <strong className="font-semibold text-[#0F172A]">
                            {formatDisplayDate(product.expiryDate)}
                          </strong>
                        </span>
                        {product.notes && (
                          <span className="text-slate-500">
                            • {product.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Status Badge + Progress */}
                  {!showUsed && (
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-2 lg:w-52 shrink-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${meta.badge}`}
                        >
                          <StatusIcon status={statusKey} className="w-3.5 h-3.5" />
                          {meta.label} • {formatDaysRemainingText(days)}
                        </span>
                      </div>
                      <div
                        className={`w-full max-w-[200px] h-2 rounded-full overflow-hidden ${meta.barTrack}`}
                        role="progressbar"
                        aria-valuenow={progressPct}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`Expiry urgency for ${product.name}`}
                      >
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${meta.barFill}`}
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Right: Quick Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {showUsed ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onRestoreUsed(product)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-[#0F172A] transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                          Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(product)}
                          aria-label={`Delete ${product.name}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-900 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onPreviewProductAlert(product)}
                          title="Preview WhatsApp/SMS Alert"
                          aria-label={`Preview alert message for ${product.name}`}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-800 transition-colors"
                        >
                          <MessageSquareText
                            className="w-4 h-4"
                            aria-hidden="true"
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() => onMarkUsed(product)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-teal-200 bg-teal-50 hover:bg-teal-100 text-xs font-semibold text-teal-900 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" aria-hidden="true" />
                          Mark as Used
                        </button>

                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          aria-label={`Edit ${product.name}`}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(product)}
                          aria-label={`Delete ${product.name}`}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

