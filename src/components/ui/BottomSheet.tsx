import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface BottomSheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
        onClick={onClose}
        aria-hidden='true'
      />
      <div
        className='relative bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[90vh] flex flex-col'
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className='h-14 px-5 border-b border-border flex items-center justify-between flex-shrink-0'>
          <h2 className='font-medium text-navy'>{title}</h2>
          <button
            type='button'
            onClick={onClose}
            className='p-2 min-h-[44px] min-w-[44px] text-text-muted hover:text-navy hover:bg-surface-3 rounded-lg flex items-center justify-center'
            aria-label='Close'
          >
            <X className='w-5 h-5' />
          </button>
        </div>
        <div className='overflow-y-auto'>{children}</div>
      </div>
    </div>
  )
}
