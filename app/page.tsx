import MainCarousel from "./_components/MainCarousel";
import ProductList from "./_components/ProductList";
import BestProductList from "./_components/BestProductList";
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

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        <MiddleBanner />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <QuickCategory />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 flex flex-col gap-16">
        <BestProductList />

        <section className="w-full">
          <div className="mb-6">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              추천 상품
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              트렌드를 앞서가는 T-Mall의 제안
            </p>
          </div>
          <ProductList />
        </section>

        <aside className="hidden 2xl:block absolute top-0 -right-36 w-32 h-full z-40 2xl:w-28 2xl:-right-24">
          <div className="sticky top-32">
            <SideQuickMenu />
          </div>
        </aside>
      </div>
    </div>
  );
}
