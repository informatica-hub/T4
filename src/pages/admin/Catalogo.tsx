import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { CatalogManager } from "@/components/admin/CatalogManager";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

export default function AdminCatalogo() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-12 py-[10px]">
      <Seo title="Admin · Catálogo | T4" description="Gestión de catálogo." noindex />
      <div className="container-width px-4 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Administración del Catálogo</h1>
            <p className="text-muted-foreground">Gestiona categorías y productos del catálogo.</p>
          </div>
          <Link to="/admin/guia">
            <Button variant="outline" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Guía paso a paso
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Productos</TabsTrigger>
            <TabsTrigger value="categories">Categorías</TabsTrigger>
          </TabsList>
          <TabsContent value="products" className="mt-6">
            <CatalogManager />
          </TabsContent>
          <TabsContent value="categories" className="mt-6">
            <CategoryManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
