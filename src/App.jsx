import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  STORAGE_KEYS,
  DEFAULT_SETTINGS,
  getInitialProducts,
  getDaysRemaining,
  getExpiryStatus,
  isWithinReminderWindow,
  buildReminderMessage,
} from './utils/expiry'
import { Header } from './components/Header'
import { GreetingBanner } from './components/GreetingBanner'
import { StatusOverviewCards } from './components/StatusOverviewCards'
import { ExpiredAlertBanner } from './components/ExpiredAlertBanner'
import { ProductList } from './components/ProductList'
import { ProductModal } from './components/ProductModal'
import { AlertSettingsPanel } from './components/AlertSettingsPanel'
import { WhatsAppPreviewModal } from './components/WhatsAppPreviewModal'
import { NotificationCenter } from './components/NotificationCenter'
import { ToastContainer } from './components/ToastContainer'

function loadStoredProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {
    // Fallback to seeded demo data
  }
  const seeded = getInitialProducts()
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(seeded))
  return seeded
}

function loadStoredSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
    }
  } catch {
    // Fallback to default settings
  }
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS))
  return DEFAULT_SETTINGS
}

function getInitialToasts(initialProducts, initialSettings) {
  const matches = initialProducts
    .filter(
      (p) => !p.used && isWithinReminderWindow(p, initialSettings.defaultLeadTimeDays)
    )
    .sort((a, b) => getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate))

  const exactMatch = matches.find(
    (p) => getDaysRemaining(p.expiryDate) === initialSettings.defaultLeadTimeDays
  )
  const target = exactMatch || matches[0]
  if (!target) return []

  const days = getDaysRemaining(target.expiryDate)
  return [
    {
      id: 'initial-reminder-toast',
      title: `${initialSettings.defaultLeadTimeDays}-Day Reminder Triggered`,
      message: buildReminderMessage(target, days),
      variant: 'alert',
      product: target,
    },
  ]
}

export default function App() {
  const [products, setProducts] = useState(loadStoredProducts)
  const [settings, setSettings] = useState(loadStoredSettings)

  const [activeTab, setActiveTab] = useState('dashboard') // 'dashboard' | 'inventory' | 'settings'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [sortBy, setSortBy] = useState('expiry')
  const [showUsed, setShowUsed] = useState(false)

  // Modals & Drawers
  const [productModal, setProductModal] = useState({
    isOpen: false,
    mode: 'add',
    product: null,
  })
  const [previewModal, setPreviewModal] = useState({
    isOpen: false,
    focusedProduct: null,
  })
  const [isNotifOpen, setIsNotifOpen] = useState(false)

  // Toasts
  const [toasts, setToasts] = useState(() =>
    getInitialToasts(products, settings)
  )

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      dismissToast('initial-reminder-toast')
    }, 8000)
    return () => clearTimeout(timer)
  }, [dismissToast])

  const pushToast = useCallback(
    ({ title, message, variant = 'alert', product = null }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
      setToasts((prev) => [...prev.slice(-3), { id, title, message, variant, product }])
      setTimeout(() => {
        dismissToast(id)
      }, 6500)
    },
    [dismissToast]
  )

  // Sync products & settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products))
    } catch {
      // Ignore storage quota issues
    }
  }, [products])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch {
      // Ignore storage quota issues
    }
  }, [settings])

  // Compute live counts & reminder matches
  const { counts, expiredProducts, reminderMatches } = useMemo(() => {
    const nextCounts = { urgent: 0, soon: 0, watch: 0, expired: 0, safe: 0 }
    const nextExpired = []
    const nextMatches = []

    for (const item of products) {
      if (item.used) continue
      const days = getDaysRemaining(item.expiryDate)
      const status = getExpiryStatus(days)
      nextCounts[status] = (nextCounts[status] || 0) + 1

      if (status === 'expired') {
        nextExpired.push(item)
      }
      if (isWithinReminderWindow(item, settings.defaultLeadTimeDays)) {
        nextMatches.push(item)
      }
    }

    nextExpired.sort(
      (a, b) =>
        getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate)
    )
    nextMatches.sort(
      (a, b) =>
        getDaysRemaining(a.expiryDate) - getDaysRemaining(b.expiryDate)
    )

    return {
      counts: nextCounts,
      expiredProducts: nextExpired,
      reminderMatches: nextMatches,
    }
  }, [products, settings.defaultLeadTimeDays])

  // Handlers
  const handleSelectStatusFromCard = (status) => {
    setShowUsed(false)
    setSelectedStatus(status)
  }

  const handleSaveProduct = (formData) => {
    if (productModal.mode === 'edit' || productModal.mode === 'restock') {
      const updated = {
        ...productModal.product,
        name: formData.name,
        category: formData.category,
        expiryDate: formData.expiryDate,
        customLeadTime: formData.customLeadTime,
        notes: formData.notes,
        used: false,
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      )
      setProductModal({ isOpen: false, mode: 'add', product: null })

      const days = getDaysRemaining(updated.expiryDate)
      if (isWithinReminderWindow(updated, settings.defaultLeadTimeDays)) {
        pushToast({
          title:
            productModal.mode === 'restock'
              ? 'Item Restocked & Active'
              : 'Product Updated • Reminder Active',
          message: buildReminderMessage(updated, days),
          variant: 'alert',
          product: updated,
        })
      } else {
        pushToast({
          title:
            productModal.mode === 'restock'
              ? 'Product Restocked'
              : 'Product Updated',
          message: `${updated.name} saved with expiry on ${updated.expiryDate}.`,
          variant: 'success',
        })
      }
      return
    }

    // Add mode
    const created = {
      id: `prod-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: formData.name,
      category: formData.category,
      expiryDate: formData.expiryDate,
      customLeadTime: formData.customLeadTime,
      notes: formData.notes,
      used: false,
      createdAt: new Date().toISOString(),
    }
    setProducts((prev) => [created, ...prev])
    setProductModal({ isOpen: false, mode: 'add', product: null })

    const days = getDaysRemaining(created.expiryDate)
    if (days < 0 || isWithinReminderWindow(created, settings.defaultLeadTimeDays)) {
      pushToast({
        title: days < 0 ? 'Past-Due Item Added' : 'Alert Window Triggered',
        message: buildReminderMessage(created, days),
        variant: 'alert',
        product: created,
      })
    } else {
      pushToast({
        title: 'Product Added',
        message: `${created.name} added to your ${created.category} tracker.`,
        variant: 'success',
      })
    }
  }

  const handleMarkUsed = (product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, used: true } : p))
    )
    pushToast({
      title: 'Marked as Used',
      message: `${product.name} moved to Used History.`,
      variant: 'success',
    })
  }

  const handleRestoreUsed = (product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, used: false } : p))
    )
    pushToast({
      title: 'Product Restored',
      message: `${product.name} is back in active tracking.`,
      variant: 'success',
    })
  }

  const handleDeleteProduct = (product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
    pushToast({
      title: 'Product Removed',
      message: `${product.name} was deleted from your tracker.`,
      variant: 'success',
    })
  }

  const handleDisposeExpired = (product) => {
    setProducts((prev) => prev.filter((p) => p.id !== product.id))
    pushToast({
      title: 'Safely Disposed',
      message: `${product.name} has been removed from your expired list.`,
      variant: 'success',
    })
  }

  const handleUpdateSettings = (patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      if (
        patch.defaultLeadTimeDays !== undefined &&
        patch.defaultLeadTimeDays !== prev.defaultLeadTimeDays
      ) {
        const matchingNow = products.filter(
          (p) => !p.used && isWithinReminderWindow(p, patch.defaultLeadTimeDays)
        )
        const first = matchingNow[0]
        pushToast({
          title: `Alert Rule Updated (${patch.defaultLeadTimeDays} Days)`,
          message: first
            ? `${matchingNow.length} ${
                matchingNow.length === 1 ? 'item matches' : 'items match'
              }. ${buildReminderMessage(first, getDaysRemaining(first.expiryDate))}`
            : `Rule set to ${patch.defaultLeadTimeDays} days before expiry. No active items match right now.`,
          variant: first ? 'alert' : 'success',
          product: first || null,
        })
      }
      return next
    })
  }

  const handleSimulateDailyAlerts = () => {
    const target = reminderMatches[0] || expiredProducts[0]
    if (!target) {
      pushToast({
        title: 'Daily Alert Simulation',
        message: `No items currently match your ${settings.defaultLeadTimeDays}-day alert window.`,
        variant: 'success',
      })
      return
    }
    const days = getDaysRemaining(target.expiryDate)
    pushToast({
      title: `Simulated ${settings.channel.toUpperCase()} Alert`,
      message: buildReminderMessage(target, days),
      variant: 'alert',
      product: target,
    })
  }

  const handleResetDemoData = () => {
    const seeded = getInitialProducts()
    setProducts(seeded)
    setSettings(DEFAULT_SETTINGS)
    setSelectedCategory('All')
    setSelectedStatus('all')
    setSearchQuery('')
    setShowUsed(false)
    pushToast({
      title: 'Demo Data Restored',
      message: 'Sample inventory (including 14-day & expired items) and 14-day alert rules reset.',
      variant: 'success',
    })
  }

  const totalAlertCount = reminderMatches.length + expiredProducts.length

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        alertCount={totalAlertCount}
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenPreview={() =>
          setPreviewModal({ isOpen: true, focusedProduct: null })
        }
        onOpenAddModal={() =>
          setProductModal({ isOpen: true, mode: 'add', product: null })
        }
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {activeTab === 'dashboard' && (
          <>
            <GreetingBanner
              userName={settings.userName}
              counts={counts}
              reminderMatchesCount={reminderMatches.length}
              defaultLeadTimeDays={settings.defaultLeadTimeDays}
              preferredTime={settings.preferredTime}
              onOpenSettings={() => setActiveTab('settings')}
            />

            <ExpiredAlertBanner
              expiredProducts={expiredProducts}
              onDispose={handleDisposeExpired}
              onRestock={(item) =>
                setProductModal({ isOpen: true, mode: 'restock', product: item })
              }
              onFilterExpired={() => {
                setShowUsed(false)
                setSelectedStatus('expired')
              }}
            />

            <StatusOverviewCards
              counts={counts}
              selectedStatus={selectedStatus}
              onSelectStatus={handleSelectStatusFromCard}
            />

            <ProductList
              products={products}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showUsed={showUsed}
              onToggleShowUsed={setShowUsed}
              defaultLeadTimeDays={settings.defaultLeadTimeDays}
              onMarkUsed={handleMarkUsed}
              onRestoreUsed={handleRestoreUsed}
              onEdit={(item) =>
                setProductModal({ isOpen: true, mode: 'edit', product: item })
              }
              onDelete={handleDeleteProduct}
              onPreviewProductAlert={(item) =>
                setPreviewModal({ isOpen: true, focusedProduct: item })
              }
              onOpenAddModal={() =>
                setProductModal({ isOpen: true, mode: 'add', product: null })
              }
            />
          </>
        )}

        {activeTab === 'inventory' && (
          <>
            <ExpiredAlertBanner
              expiredProducts={expiredProducts}
              onDispose={handleDisposeExpired}
              onRestock={(item) =>
                setProductModal({ isOpen: true, mode: 'restock', product: item })
              }
              onFilterExpired={() => {
                setShowUsed(false)
                setSelectedStatus('expired')
              }}
            />

            <ProductList
              products={products}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              sortBy={sortBy}
              onSortChange={setSortBy}
              showUsed={showUsed}
              onToggleShowUsed={setShowUsed}
              defaultLeadTimeDays={settings.defaultLeadTimeDays}
              onMarkUsed={handleMarkUsed}
              onRestoreUsed={handleRestoreUsed}
              onEdit={(item) =>
                setProductModal({ isOpen: true, mode: 'edit', product: item })
              }
              onDelete={handleDeleteProduct}
              onPreviewProductAlert={(item) =>
                setPreviewModal({ isOpen: true, focusedProduct: item })
              }
              onOpenAddModal={() =>
                setProductModal({ isOpen: true, mode: 'add', product: null })
              }
            />
          </>
        )}

        {activeTab === 'settings' && (
          <AlertSettingsPanel
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            products={products}
            onTriggerTestToast={handleSimulateDailyAlerts}
            onOpenWhatsAppPreview={() =>
              setPreviewModal({ isOpen: true, focusedProduct: null })
            }
            onResetDemoData={handleResetDemoData}
          />
        )}
      </main>

      {/* Modals & Notifications */}
      {productModal.isOpen && (
        <ProductModal
          key={`${productModal.mode}-${productModal.product?.id || 'new'}`}
          mode={productModal.mode}
          initialProduct={productModal.product}
          defaultLeadTimeDays={settings.defaultLeadTimeDays}
          onClose={() =>
            setProductModal({ isOpen: false, mode: 'add', product: null })
          }
          onSave={handleSaveProduct}
        />
      )}

      <WhatsAppPreviewModal
        isOpen={previewModal.isOpen}
        onClose={() =>
          setPreviewModal({ isOpen: false, focusedProduct: null })
        }
        products={products}
        settings={settings}
        focusedProduct={previewModal.focusedProduct}
        onSendTestToast={(message, product) => {
          pushToast({
            title: 'Test Reminder Delivered',
            message,
            variant: 'alert',
            product,
          })
        }}
      />

      <NotificationCenter
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        products={products}
        settings={settings}
        onSimulateToasts={handleSimulateDailyAlerts}
        onOpenPreviewForProduct={(item) => {
          setIsNotifOpen(false)
          setPreviewModal({ isOpen: true, focusedProduct: item })
        }}
      />

      <ToastContainer
        toasts={toasts}
        onDismiss={dismissToast}
        onOpenPreview={(product) =>
          setPreviewModal({ isOpen: true, focusedProduct: product })
        }
      />
    </div>
  )
}
