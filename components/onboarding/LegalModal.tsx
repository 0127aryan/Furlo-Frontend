'use client'

type LegalModalProps = {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}

export function LegalModal({ open, title, onClose, children }: LegalModalProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(28,35,41,0.45)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[85vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ background: '#fffbf7', border: '1px solid #ede8e1' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: '#ede8e1' }}>
          <h2 className="font-bold text-[18px]" style={{ fontFamily: 'Outfit, sans-serif', color: '#2D4A3E' }}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-black/5"
            aria-label="Close"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#554338' }}>
              close
            </span>
          </button>
        </div>
        <div className="overflow-y-auto px-5 py-4 text-[14px] leading-relaxed" style={{ color: '#554338' }}>
          {children}
        </div>
      </div>
    </div>
  )
}
