import { Json } from "@/lib/config/supabase/types_db";

export interface ProductType {
  category: string | null;
  color: string | null;
  created_at: string | null;
  deleted: boolean;
  deleted_at: string | null;
  description: string | null;
  gender: string | null;
  id: string;
  image_url: string | null;
  name: string;
  price: number;
  rating_map: Json | null;
  sales_count: number | null;
  stock_by_size: Json | null;
  subcategory: string | null;
  tags: string[] | null;
  total_stock: number | null;
  updated_at: string | null;
  user_id: string | null;
  views: number;

  favorite_count?: number;
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

export type CartItemType = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
  };
  options: Json | null;
};

export interface OrderItemType {
  id: string;
  quantity: number;
  price: number;
  size: string | null;
  delivery_status: string | null;
  products: {
    id: string;
    name: string;
    image_url: string | null;
  };
}

export interface OrderUserType {
  user_name: string | null;
  email: string | null;
}

export interface OrderDetailsType {
  id: string;
  created_at: string | null;
  request: string | null;
  receiver: string | null;
  detail_address: string | null;
  order_items: OrderItemType[];
  user: OrderUserType | null;
}

type Product = {
  id: string;
  price: number;
};

type ItemOptions = {
  size?: string | null;
};

export interface CheckoutItem {
  product: Product;
  quantity: number;
  options?: ItemOptions;
}

export interface OrderItem {
  price: number | null;
  quantity: number | null;
}
