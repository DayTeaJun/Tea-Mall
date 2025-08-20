import MainCarousel from "./_components/MainCarousel";
import ProductList from "./_components/ProductList";

export default function Home() {
  return (
    <main className="sm:mt-4">
      <section className="text-center">
        <div className="hidden sm:block">
          <h1 className="text-3xl font-bold text-green-600">Tea Mall</h1>

          <p className="text-gray-500 mt-2">
            당신의 취향을 찾아드립니다. 다양한 티백을 만나보세요.
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
