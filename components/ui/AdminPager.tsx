'use client'

import { PAGE_SIZE, pageCount } from '@/lib/pagination'

type Props = {
  page: number
  totalCount: number
  limit?: number
  onPage: (page: number) => void
}

export function AdminPager({ page, totalCount, limit = PAGE_SIZE, onPage }: Props) {
  const pages = pageCount(totalCount, limit)
  return (
    <div className="flex items-center justify-between gap-3 pt-4">
      <p className="text-[12px] text-[#887366]">
        Page {page} of {pages}
        {totalCount ? ` · ${totalCount} total` : ''}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
          className="px-3 py-1.5 rounded-lg border border-[#EDE8E1] text-[12px] font-medium text-[#163328] disabled:opacity-40"
        >
          Prev
        </button>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onPage(page + 1)}
          className="px-3 py-1.5 rounded-lg border border-[#EDE8E1] text-[12px] font-medium text-[#163328] disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}
