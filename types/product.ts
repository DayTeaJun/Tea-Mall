export interface ProductType {
  id?: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  user_id?: string | null;
}

export interface CreateProductType {
  name: string;
  description?: string;
  price: number;
  image_url: string;
  detailImages: string[];
}
