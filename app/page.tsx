import MainCarousel from "./_components/MainCarousel";
import ProductList from "./_components/ProductList";
import SideQuickMenu from "./_components/SideQuickMenu";

export default function Home() {
  return (
    <div className="w-full sm:mt-6 mt-0 my-2">
      <section className="text-center w-full">
        <div className="hidden sm:block mb-4">
          <h1 className="text-3xl font-bold text-green-600">T-Mall</h1>
          <p className="text-gray-500 mt-2">
            사이즈, 핏, 가격까지 한 번에 비교하고 고르는 남녀 공용부터 트렌디
            라인
          </p>
        </div>
        <MainCarousel />
      </section>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-8 mt-12">
        <section className="w-full">
          <h2 className="text-xl font-semibold mb-4">추천 상품</h2>
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
