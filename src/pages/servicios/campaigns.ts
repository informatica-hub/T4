import { supabase } from "@/integrations/supabase/client";
import { Campaign, FeaturedProduct } from "@/types/campaign";

// ============ CAMPAIGNS ============
export async function getCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createCampaign(
  payload: { title: string; description?: string; cta_text?: string; cta_link?: string; sort_order?: number },
  file: File
) {
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from("campaigns")
    .upload(path, file, { cacheControl: "3600" });
  if (upErr) throw upErr;

  const { data: url } = supabase.storage.from("campaigns").getPublicUrl(path);

  const { error } = await supabase.from("campaigns").insert({
    ...payload,
    image_url: url.publicUrl,
  });
  if (error) throw error;
}

export async function deleteCampaign(id: string, imageUrl: string) {
  const path = imageUrl.split("/campaigns/")[1];
  if (path) {
    await supabase.storage.from("campaigns").remove([path]);
  }
  const { error } = await supabase.from("campaigns").delete().eq("id", id);
  if (error) throw error;
}

// ============ FEATURED PRODUCTS ============
export async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
  const { data, error } = await supabase
    .from("featured_products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createFeaturedProduct(payload: {
  product_id: string;
  badge?: string;
  custom_title?: string;
  custom_description?: string;
  sort_order?: number;
}) {
  const { error } = await supabase.from("featured_products").insert(payload);
  if (error) throw error;
}

export async function deleteFeaturedProduct(id: string) {
  const { error } = await supabase.from("featured_products").delete().eq("id", id);
  if (error) throw error;
}