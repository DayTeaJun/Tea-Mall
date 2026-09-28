export default function ProductCardSkeleton({
  dark = false,
}: {
  dark?: boolean;
}) {
  return (
    <div
      className={`flex w-full flex-col transition-all duration-300 ${
        dark ? "bg-transparent" : "bg-white"
      }`}
    >
      <div
        className={`relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-sm animate-pulse ${
          dark ? "bg-white/10" : "bg-[#f4f4f4]"
        }`}
      />

      <div className="flex flex-1 flex-col pt-2.5 px-0.5">
        <div className="flex flex-col gap-1.5 min-h-[38px] pb-2">
          <div
            className={`h-3.5 w-full rounded-sm animate-pulse ${dark ? "bg-white/10" : "bg-gray-200"}`}
          />
          <div
            className={`h-3.5 w-2/3 rounded-sm animate-pulse ${dark ? "bg-white/10" : "bg-gray-200"}`}
          />
        </div>

        <div className="mt-auto pt-1 flex flex-col gap-1">
          <div
            className={`h-4 w-1/4 rounded-sm animate-pulse ${dark ? "bg-white/10" : "bg-gray-200"}`}
          />

          <div className="flex items-center gap-2 mt-0.5">
            <div
              className={`h-3 w-8 rounded-sm animate-pulse ${dark ? "bg-white/5" : "bg-gray-100"}`}
            />
            <div
              className={`h-3 w-12 rounded-sm animate-pulse ${dark ? "bg-white/5" : "bg-gray-100"}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
