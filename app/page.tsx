import ProductList from "./_components/ProductList";

export default function Home() {
  return (
    <main className="p-8 max-w-7xl mx-auto space-y-12">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-green-600">Tea Mall</h1>
        <p className="text-gray-500 mt-2">
          당신의 취향을 찾아드립니다. 다양한 티백을 만나보세요.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">추천 상품</h2>
        <ProductList />
      </section>
    </main>
  );
}
