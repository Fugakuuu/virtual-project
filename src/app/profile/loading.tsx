import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto">
      <Skeleton className="h-10 w-64 mb-8" />
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Avatar Skeleton */}
          <div className="flex flex-col items-center gap-4">
            <Skeleton className="w-32 h-32 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>

          {/* Form Skeleton */}
          <div className="flex-1 space-y-6 w-full">
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
