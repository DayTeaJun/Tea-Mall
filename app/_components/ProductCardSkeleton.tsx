export default function ProductCardSkeleton() {
  return (
    <div className="w-full transition-all duration-300 p-4 pt-0">
      <div className="w-full h-50 lg:h-60 mb-2 relative bg-gray-100 animate-pulse" />

      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />

      <div className="h-5 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />

      <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse" />
    </div>
  );
}
