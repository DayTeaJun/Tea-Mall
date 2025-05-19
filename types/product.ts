export interface ProductType {
  id?: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at?: string;
  oldImageUrl?: string;
}
