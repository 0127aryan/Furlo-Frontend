'use client'

import { useState, useEffect } from 'react'
import { toast, ToastMessage } from '@/lib/toast'

export function ToastContainer() {
  const [messages, setMessages] = useState<ToastMessage[]>([])

  useEffect(() => {
    return toast.subscribe((updatedToasts) => {
      setMessages(updatedToasts)
    })
  }, [])

  if (messages.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4">
      {messages.map((t) => {
        const isError = t.type === 'error'
        const isSuccess = t.type === 'success'

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border transition-all duration-300 transform translate-y-0 ${
              isError
                ? 'bg-[#FFDAD6] text-[#93000A] border-[#FFB4AB]'
                : isSuccess
                ? 'bg-[#C9EAD9] text-[#163328] border-[#A8DBBD]'
                : 'bg-[#163328] text-white border-[#2D4A3E]'
            }`}
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <span
              className="material-symbols-outlined text-[20px] shrink-0 mt-0.5"
              style={{
                fontVariationSettings: "'FILL' 1",
                color: isError ? '#93000A' : isSuccess ? '#163328' : '#E8843A',
              }}
            >
              {isError ? 'error' : isSuccess ? 'check_circle' : 'info'}
            </span>

            <div className="flex-1 text-[13px] font-semibold leading-snug">
              {t.message}
            </div>

            <button
              onClick={() => toast.dismiss(t.id)}
              className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        )
      })}
    </div>
  )
}
