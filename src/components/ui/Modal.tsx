import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'md' | 'lg'
}

/** Модальное окно на Radix Dialog (подход shadcn-ui). */
export function Modal({ open, onClose, title, children, size = 'md' }: Props) {
  const maxW = size === 'lg' ? 'max-w-2xl' : 'max-w-lg'

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-slate-900/60 backdrop-blur-sm" />
        <Dialog.Content
          className={cn(
            'fixed inset-x-0 bottom-0 z-[81] max-h-[90vh] overflow-y-auto rounded-t-2xl border border-slate-100 bg-white p-5 shadow-glow dark:border-slate-800 dark:bg-slate-900 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:m-4 sm:w-full sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-2xl',
            maxW,
          )}
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            {title ? (
              <Dialog.Title
                id="modal-title"
                className="font-display text-lg font-bold text-slate-900 dark:text-white"
              >
                {title}
              </Dialog.Title>
            ) : (
              <Dialog.Title className="sr-only">Диалог</Dialog.Title>
            )}
            <Dialog.Close
              type="button"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Закрыть"
            >
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            {title ? `Диалог: ${title}` : 'Модальное окно'}
          </Dialog.Description>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
