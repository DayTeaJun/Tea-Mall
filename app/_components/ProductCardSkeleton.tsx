export default function ProductCardSkeleton() {
  return (
    <article className="flex h-full sm:w-[224px] sm:h-[340px] flex-row sm:flex-col p-4 pt-0 rounded-lg bg-white transition-all duration-300 gap-3">
      <div className="relative w-full aspect-[3/4] h-full lg:h-60 mb-2 bg-gray-100 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100"
        />
      </div>

      <div className="flex flex-col w-[120px] sm:w-auto">
        <div className="h-5 w-4/5 rounded bg-gray-200 animate-pulse mb-2" />
        <div className="h-5 w-1/2 rounded bg-gray-200 animate-pulse mb-2" />

        <div className="h-5 w-3/4 rounded bg-gray-200 animate-pulse" />
      </div>
    </article>
  );
}
