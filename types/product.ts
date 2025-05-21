// types/product.ts
export type ProductType = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  user_id: string | null;
};
