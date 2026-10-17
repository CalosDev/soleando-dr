'use client'

import { useEffect, type RefObject } from 'react'

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function useDialogFocus(isOpen: boolean, dialogRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const dialog = dialogRef.current
    if (!isOpen || !dialog) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const getFocusableElements = () => Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
      .filter((element) => element.getClientRects().length > 0)

    const initialFocus = dialog.querySelector<HTMLElement>('[data-dialog-initial-focus]')
    const focusTarget = initialFocus ?? getFocusableElements()[0] ?? dialog
    focusTarget.focus()

    const handleTab = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const elements = getFocusableElements()
      const first = elements[0]
      const last = elements[elements.length - 1]
      const active = document.activeElement

      if (!first) {
        event.preventDefault()
        dialog.focus()
      } else if (!dialog.contains(active) || (event.shiftKey ? active === first : active === last)) {
        event.preventDefault()
        const target = event.shiftKey ? last : first
        target.focus()
      }
    }

    document.addEventListener('keydown', handleTab)
    return () => {
      document.removeEventListener('keydown', handleTab)
      document.body.style.overflow = originalOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [isOpen, dialogRef])
}
