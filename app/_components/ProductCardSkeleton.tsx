export default function ProductCardSkeleton() {
  return (
    <div className="flex w-full flex-col bg-white transition-all duration-300">
      <div className="relative flex aspect-[1/1] w-full items-center justify-center overflow-hidden bg-[#f4f4f4] rounded-sm animate-pulse" />

      <div className="flex flex-1 flex-col pt-2.5 px-0.5">
        <div className="flex flex-col gap-1.5 min-h-[38px] pb-2">
          <div className="h-3.5 w-full rounded-sm bg-gray-200 animate-pulse" />
          <div className="h-3.5 w-2/3 rounded-sm bg-gray-200 animate-pulse" />
        </div>

        <div className="mt-auto pt-1 flex flex-col gap-1">
          <div className="h-4 w-1/4 rounded-sm bg-gray-200 animate-pulse" />

          <div className="flex items-center gap-2 mt-0.5">
            <div className="h-3 w-8 rounded-sm bg-gray-100 animate-pulse" />
            <div className="h-3 w-12 rounded-sm bg-gray-100 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
