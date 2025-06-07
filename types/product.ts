export interface ProductType {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  user_id?: string | null;
  tags?: string[];
  category?: string;
  subcategory?: string;
  gender?: string;
  color?: string;
  stock_by_size?: Record<string, number>;
  total_stock?: number;
  detail_images?: string[];
  created_at?: string | null;
  updated_at?: string | null;
}
export interface ProductUpdateType extends ProductType {
  detail_image_urls?: string[];
  oldImageUrl?: string;
  oldDetailImageIds?: string[];
}

export interface ProductManageType extends ProductType {
  created_at: string | null;
}

export interface CreateProductType {
  name: string;
  description?: string;
  price: number;
  image_url: string;
  detailImages: string[];
  tags?: string[];
  category?: string;
  subcategory?: string;
  gender?: string;
  color?: string;
  stock_by_size?: Record<string, number>;
  total_stock?: number;
}
