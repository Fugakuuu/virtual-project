import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="relative pb-32">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-40 bg-[#001e2b]/80 backdrop-blur-md border-b border-[#00ed64]/20 p-6 flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex gap-4">
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </header>

      {/* Grid Skeleton */}
      <main className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#001e2b] border border-white/10 rounded-xl p-4 flex flex-col items-center justify-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
