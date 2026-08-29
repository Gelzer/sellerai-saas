import { Sparkles } from 'lucide-react';

export function SkeletonLoader() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/70 backdrop-blur-sm dark:bg-slate-900/70">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-brand-500/30" />
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/30">
          <Sparkles className="h-7 w-7 animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-medium text-brand-700 dark:text-brand-300">
        SellerAI генерирует карточку...
      </p>
      <div className="mt-2 w-3/4 max-w-xs space-y-2.5">
        <div className="skeleton-shimmer h-3 w-full rounded-full" />
        <div className="skeleton-shimmer h-3 w-5/6 rounded-full" />
        <div className="skeleton-shimmer h-3 w-4/6 rounded-full" />
      </div>
    </div>
  );
}
