import MainCarousel from "./_components/MainCarousel";
import ProductList from "./_components/ProductList";

export default function Home() {
  return (
    <main className="sm:mt-16 mt-12">
      <section className="text-center">
        <div className="hidden sm:block">
          <h1 className="text-3xl font-bold text-green-600">T-Mall</h1>

          <p className="text-gray-500 mt-2">
            사이즈, 핏, 가격까지 한 번에 비교하고 고르는 남녀 공용부터 트렌디
            라인
          </p>
        </div>

        <MainCarousel />
      </section>

      <section className="p-4 sm:p-8 max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">추천 상품</h2>
        <ProductList />
      </section>
    </main>
  );
}
