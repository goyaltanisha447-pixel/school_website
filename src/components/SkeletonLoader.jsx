import React from 'react';

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200 ${className}`}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-slate-100 rounded-2xl p-4 bg-white shadow-sm flex flex-col h-full">
      <Skeleton className="w-full h-48 rounded-xl mb-4" />
      <Skeleton className="h-4 w-1/3 mb-2" />
      <Skeleton className="h-6 w-3/4 mb-3" />
      <div className="flex items-center gap-1 mb-3">
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-10" />
      </div>
      <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="border border-slate-100 rounded-2xl p-6 bg-white flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-grow">
        <Skeleton className="h-5 w-2/3 mb-1" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
