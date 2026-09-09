import type { Money } from '@/features/hotels/domain/types'

export function formatMoney(money: Money) {
  const amount = Number(money.amount)
  if (!Number.isFinite(amount)) return 'Precio por confirmar'
  return new Intl.NumberFormat('es-DO', { style: 'currency', currency: money.currency, maximumFractionDigits: 0 }).format(amount)
}
