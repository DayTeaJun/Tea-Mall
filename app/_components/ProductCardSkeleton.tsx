export default function ProductCardSkeleton() {
  return (
    <div className="p-4 rounded-lg shadow animate-pulse space-y-2 bg-white">
      <div className="w-full h-40 bg-gray-200 rounded-md" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-4 bg-gray-300 rounded w-1/2 ml-auto" />
    </div>
  );
}
