import {
  ShoppingBasket,
  Pill,
  Sparkles,
  Home,
  Package,
  AlertTriangle,
  Clock,
  Eye,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react'

export function CategoryIcon({ category, className = 'w-4 h-4' }) {
  switch (category) {
    case 'Groceries':
      return <ShoppingBasket className={className} aria-hidden="true" />
    case 'Medicine':
      return <Pill className={className} aria-hidden="true" />
    case 'Cosmetics':
      return <Sparkles className={className} aria-hidden="true" />
    case 'Household':
      return <Home className={className} aria-hidden="true" />
    default:
      return <Package className={className} aria-hidden="true" />
  }
}

export function StatusIcon({ status, className = 'w-4 h-4' }) {
  switch (status) {
    case 'urgent':
      return <AlertTriangle className={className} aria-hidden="true" />
    case 'soon':
      return <Clock className={className} aria-hidden="true" />
    case 'watch':
      return <Eye className={className} aria-hidden="true" />
    case 'expired':
      return <ShieldAlert className={className} aria-hidden="true" />
    default:
      return <CheckCircle2 className={className} aria-hidden="true" />
  }
}

