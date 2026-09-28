import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminCampaignsImages from "./AdminCampaignsImages";
import AdminFeaturedProducts from "./AdminFeaturedProducts";

export default function AdminMarketing() {
  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <h1 className="text-2xl font-bold mb-6">Marketing</h1>
      <Tabs defaultValue="images">
        <TabsList>
          <TabsTrigger value="images">Campañas (imágenes)</TabsTrigger>
          <TabsTrigger value="featured">Productos destacados</TabsTrigger>
        </TabsList>
        <TabsContent value="images"><AdminCampaignsImages /></TabsContent>
        <TabsContent value="featured"><AdminFeaturedProducts /></TabsContent>
      </Tabs>
    </div>
  );
}