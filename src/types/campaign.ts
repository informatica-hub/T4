export interface Campaign {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  cta_text: string | null;
  cta_link: string | null;
  sort_order: number;
  active: boolean;
  created_at: string;
}

export interface FeaturedProduct {
  id: string;
  product_id: string;
  badge: string | null;
  custom_title: string | null;
  custom_description: string | null;
  sort_order: number;
  active: boolean;
  product?: {
    id: string;
    name: string;
    catalog_number: string | null;
    image_url: string | null;
    brand: string;
  } | null;
}