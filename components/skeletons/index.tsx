import { Skeleton } from '@/components/ui/Skeleton';

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#EDE8E1] p-4 ${className}`}>{children}</div>
  );
}

export function PostCardSkeleton() {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <Skeleton className="w-11 h-11 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-[45%]" />
          <Skeleton className="h-2.5 w-[30%]" />
        </div>
      </div>
      <div className="mt-3.5 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-[88%]" />
        <Skeleton className="h-3 w-[62%]" />
      </div>
      <Skeleton className="mt-3.5 h-40 w-full rounded-2xl" />
      <div className="mt-3.5 flex gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
      </div>
    </Card>
  );
}

export function FeedListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function NotificationRowSkeleton() {
  return (
    <div className="flex gap-3 p-3.5 bg-white rounded-2xl border border-[#EDE8E1]">
      <Skeleton className="w-10 h-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-[70%]" />
        <Skeleton className="h-2.5 w-[90%]" />
        <Skeleton className="h-2 w-[25%]" />
      </div>
    </div>
  );
}

export function NotificationListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <NotificationRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function QuestionCardSkeleton() {
  return (
    <Card>
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-3 h-3.5 w-full" />
      <Skeleton className="mt-2 h-3.5 w-[78%]" />
      <div className="mt-3 flex gap-2">
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-[72px] rounded-full" />
      </div>
    </Card>
  );
}

export function QuestionListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <QuestionCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PackCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EDE8E1] p-3.5">
      <Skeleton className={`w-full rounded-2xl ${featured ? 'h-36' : 'h-24'}`} />
      <Skeleton className="mt-3 h-4 w-[65%]" />
      <Skeleton className="mt-2 h-2.5 w-[40%]" />
      <Skeleton className="mt-1.5 h-2.5 w-[30%]" />
    </div>
  );
}

export function PackListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <PackCardSkeleton featured />
      <div className="grid grid-cols-2 gap-4">
        <PackCardSkeleton />
        <PackCardSkeleton />
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center py-4">
        <Skeleton className="w-22 h-22 rounded-full" />
        <Skeleton className="mt-4 h-5 w-[55%]" />
        <Skeleton className="mt-2.5 h-3 w-[40%]" />
        <div className="mt-4 flex gap-5">
          <Skeleton className="h-9 w-12 rounded-lg" />
          <Skeleton className="h-9 w-12 rounded-lg" />
          <Skeleton className="h-9 w-12 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-full" />
        <Skeleton className="h-9 flex-1 rounded-full" />
        <Skeleton className="h-9 flex-1 rounded-full" />
      </div>
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}

export function QuestionDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-[45%]" />
            <Skeleton className="h-2.5 w-[30%]" />
          </div>
        </div>
        <Skeleton className="mt-4 h-4.5 w-full" />
        <Skeleton className="mt-2.5 h-4.5 w-[92%]" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-[85%]" />
          <Skeleton className="h-3 w-[70%]" />
        </div>
      </Card>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i}>
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-3 w-[35%]" />
          </div>
          <Skeleton className="mt-3 h-3 w-full" />
          <Skeleton className="mt-2 h-3 w-[80%]" />
        </Card>
      ))}
    </div>
  );
}

export function CommunityDetailSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-5 w-[60%]" />
      <Skeleton className="h-3 w-[80%]" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex gap-3">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-20 rounded-full" />
      </div>
      <FeedListSkeleton count={2} />
    </div>
  );
}

export function SidebarWidgetSkeleton() {
  return (
    <div className="space-y-3 py-1">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-2.5 w-[70%]" />
            <Skeleton className="h-2 w-[45%]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ListRowSkeleton() {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-[#EDE8E1]">
      <Skeleton className="w-9 h-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-2.5 w-1/3" />
      </div>
    </div>
  );
}

export function ListRowsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <ListRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function SettingsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <Card>
        <div className="flex items-center gap-3">
          <Skeleton className="w-11 h-11 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-[70%]" />
            <Skeleton className="h-2.5 w-[40%]" />
          </div>
          <Skeleton className="w-11 h-7 rounded-full" />
        </div>
      </Card>
      <div className="bg-white rounded-2xl border border-[#EDE8E1] overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-[#EDE8E1] last:border-0">
            <Skeleton className="w-7 h-7 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-[55%]" />
              <Skeleton className="h-2.5 w-[80%]" />
            </div>
            <Skeleton className="w-11 h-7 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EDE8E1] overflow-hidden">
      <div className="p-4 border-b border-[#EDE8E1]">
        <Skeleton className="h-4 w-1/3" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 border-b border-[#EDE8E1] last:border-0">
          <Skeleton className="h-3 flex-1" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      ))}
    </div>
  );
}
