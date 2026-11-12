import { useState } from 'react'
import { X, Calendar, Bell, PackagePlus } from 'lucide-react'
import { CATEGORIES, getDateOffsetFromToday } from '../utils/expiry'

export function ProductModal({
  mode, // 'add' | 'edit' | 'restock'
  initialProduct,
  defaultLeadTimeDays,
  onClose,
  onSave,
}) {
  const isEditingOrRestock =
    Boolean(initialProduct) && (mode === 'edit' || mode === 'restock')
  const hasCustomLead =
    isEditingOrRestock &&
    initialProduct.customLeadTime !== null &&
    initialProduct.customLeadTime !== undefined &&
    initialProduct.customLeadTime !== ''

  const [name, setName] = useState(() =>
    isEditingOrRestock ? initialProduct.name || '' : ''
  )
  const [category, setCategory] = useState(() =>
    isEditingOrRestock ? initialProduct.category || 'Groceries' : 'Groceries'
  )
  const [expiryDate, setExpiryDate] = useState(() =>
    mode === 'restock'
      ? getDateOffsetFromToday(30)
      : isEditingOrRestock
      ? initialProduct.expiryDate || getDateOffsetFromToday(14)
      : getDateOffsetFromToday(14)
  )
  const [leadMode, setLeadMode] = useState(() =>
    hasCustomLead ? 'custom' : 'default'
  )
  const [customLeadDays, setCustomLeadDays] = useState(() =>
    hasCustomLead
      ? String(initialProduct.customLeadTime)
      : String(defaultLeadTimeDays)
  )
  const [notes, setNotes] = useState(() =>
    isEditingOrRestock ? initialProduct.notes || '' : ''
  )
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter a product name.')
      return
    }
    if (!expiryDate) {
      setError('Please select an expiry date.')
      return
    }

    let parsedCustomLead = null
    if (leadMode === 'custom') {
      const n = Number(customLeadDays)
      if (Number.isNaN(n) || n < 0 || n > 180) {
        setError('Custom alert lead time must be between 0 and 180 days.')
        return
      }
      parsedCustomLead = Math.round(n)
    }

    onSave({
      id: initialProduct?.id,
      name: trimmed,
      category,
      expiryDate,
      customLeadTime: parsedCustomLead,
      notes: notes.trim(),
    })
  }

  const title =
    mode === 'edit'
      ? 'Edit Product'
      : mode === 'restock'
      ? 'Restock Expired Product'
      : 'Add New Product'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center">
              <PackagePlus className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="product-modal-title"
                className="text-lg font-bold text-[#0F172A]"
              >
                {title}
              </h2>
              {mode === 'restock' && (
                <p className="text-xs text-teal-800 font-medium">
                  Set the new expiry date for your replacement item
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-[#0F172A] hover:bg-slate-200/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm font-medium text-rose-900"
            >
              {error}
            </div>
          )}

          {/* Product Name */}
          <div>
            <label
              htmlFor="product-name"
              className="block text-sm font-semibold text-[#0F172A] mb-1.5"
            >
              Product Name <span className="text-rose-600">*</span>
            </label>
            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Greek Yogurt, Ibuprofen 200mg, Sunscreen SPF 50"
              autoFocus
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>

          {/* Category + Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="product-category"
                className="block text-sm font-semibold text-[#0F172A] mb-1.5"
              >
                Category
              </label>
              <select
                id="product-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-expiry"
                className="block text-sm font-semibold text-[#0F172A] mb-1.5"
              >
                Expiry Date <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  id="product-expiry"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>
          </div>

          {/* Quick Date Helpers */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 mr-1">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              Quick set:
            </span>
            {[
              { label: '+3 days', offset: 3 },
              { label: '+7 days', offset: 7 },
              { label: '+14 days', offset: 14 },
              { label: '+30 days', offset: 30 },
              { label: '+90 days', offset: 90 },
            ].map((preset) => (
              <button
                key={preset.offset}
                type="button"
                onClick={() => setExpiryDate(getDateOffsetFromToday(preset.offset))}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-900 border border-slate-200 text-xs font-semibold text-slate-700 transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom Alert Lead Time */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-700" aria-hidden="true" />
              <span className="text-sm font-semibold text-[#0F172A]">
                Alert Lead Time
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                  leadMode === 'default'
                    ? 'bg-white border-teal-600 ring-1 ring-teal-600'
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="leadMode"
                  checked={leadMode === 'default'}
                  onChange={() => setLeadMode('default')}
                  className="accent-teal-700"
                />
                <div>
                  <span className="block text-sm font-semibold text-[#0F172A]">
                    Global Default
                  </span>
                  <span className="block text-xs text-slate-500">
                    {defaultLeadTimeDays} days before expiry
                  </span>
                </div>
              </label>

              <label
                className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-colors ${
                  leadMode === 'custom'
                    ? 'bg-white border-teal-600 ring-1 ring-teal-600'
                    : 'bg-white/60 border-slate-200 hover:bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="leadMode"
                  checked={leadMode === 'custom'}
                  onChange={() => setLeadMode('custom')}
                  className="accent-teal-700"
                />
                <div>
                  <span className="block text-sm font-semibold text-[#0F172A]">
                    Custom Override
                  </span>
                  <span className="block text-xs text-slate-500">
                    Set specific days
                  </span>
                </div>
              </label>
            </div>

            {leadMode === 'custom' && (
              <div className="flex items-center gap-3 pt-1">
                <label
                  htmlFor="custom-lead-days"
                  className="text-xs font-semibold text-slate-700"
                >
                  Remind me
                </label>
                <input
                  id="custom-lead-days"
                  type="number"
                  min="0"
                  max="180"
                  value={customLeadDays}
                  onChange={(e) => setCustomLeadDays(e.target.value)}
                  className="w-24 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <span className="text-xs font-medium text-slate-600">
                  days before expiry
                </span>
              </div>
            )}
          </div>

          {/* Optional Storage Note */}
          <div>
            <label
              htmlFor="product-notes"
              className="block text-sm font-semibold text-[#0F172A] mb-1.5"
            >
              Storage Location / Note{' '}
              <span className="text-xs font-normal text-slate-500">
                (Optional)
              </span>
            </label>
            <input
              id="product-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Pantry middle shelf, Door compartment"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-sm font-semibold text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold shadow-sm transition-colors"
            >
              {mode === 'edit'
                ? 'Save Changes'
                : mode === 'restock'
                ? 'Update & Restock'
                : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
