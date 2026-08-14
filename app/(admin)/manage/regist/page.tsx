import ProductForm from "./_components/ProductForm";

export default function AddProductPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-5 bg-white rounded-xl">
      <div className="border-b pb-4">
        <h2 className="text-xl font-bold text-gray-900 pb-2">신규 상품 등록</h2>
        <p className="text-sm text-gray-500">
          쇼핑몰에 판매할 상품의 정보와 옵션을 입력해주세요.
        </p>
      </div>

      <ProductForm />
    </div>
  );
}
