import { Json } from "@/lib/config/supabase/types_db";

export interface ProductType {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  description: string | null;
  user_id: string | null;
  tags: string[] | null;
  category: string | null;
  subcategory: string | null;
  gender: string | null;
  color: string | null;
  stock_by_size: Json | null;
  total_stock: number | null;
  rating_map?: Json | null;
  created_at: string | null;
  updated_at: string | null;
  deleted?: boolean;
  deleted_at?: string | null;
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
