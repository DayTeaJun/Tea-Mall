import MainCarousel from "./_components/MainCarousel";
import BestProductList from "./_components/BestProductList";
import DiscountProductList from "./_components/DiscountProductList";
import ProductList from "./_components/ProductList";
import SideQuickMenu from "./_components/SideQuickMenu";
import QuickCategory from "./_components/QuickCategory";
import MiddleBanner from "./_components/MiddleBanner";

export default function Home() {
  return (
    <div className="w-full sm:mt-4 mt-0 mb-16">
      <section className="text-center w-full">
        <div className="hidden sm:block mb-6">
          <h1 className="text-3xl font-bold text-green-600 tracking-tight">
            T-Mall
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            사이즈, 핏, 가격까지 한 번에 비교하고 고르는 남녀 공용부터 트렌디
            라인
          </p>
        </div>
        <MainCarousel />
      </section>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        <div className="mt-8">
          <MiddleBanner />
        </div>

        <div className="py-8">
          <QuickCategory />
        </div>

        <div className="flex flex-col gap-16">
          <DiscountProductList />

          <BestProductList />

          <section className="w-full">
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                추천 상품
              </h2>
              <p className="text-sm text-gray-400 mt-1">
                취향을 저격할 다음 아이템을 만나보세요
              </p>
            </div>
            <ProductList />
          </section>
        </div>

        {/* 우측 하단 툴바(ToolComponent, fixed bottom-5 right-5)와 같은 높이(y축)에
            나란히 오도록 fixed로 위치를 맞춤 */}
        <aside className="hidden 2xl:block fixed bottom-5 right-24 w-28 z-40">
          <SideQuickMenu />
        </aside>
      </div>
    </div>
  );
}
