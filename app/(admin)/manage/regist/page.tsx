import ProductForm from "./_components/ProductForm";

export default function AddProductPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5 bg-white rounded-xl">
      <h2 className="text-center text-xl font-bold mb-4">상품 등록</h2>

      <ProductForm />
    </div>
  );
}
