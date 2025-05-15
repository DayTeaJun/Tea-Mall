import ProductForm from "./_components/ProductForm";

export default function AddProductPage() {
  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 space-y-5 bg-white rounded-xl">
      <h2 className="text-center text-3xl font-bold">상품 등록</h2>

      <ProductForm />
    </div>
  );
}
