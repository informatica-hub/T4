import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Link } from "react-router-dom";
import { PackageSearch, Award, Dna, BookOpen, FolderKanban } from "lucide-react";
import { Seo } from "@/components/seo/Seo";

const adminLinks = [
  {
    title: "Proyectos de clientes",
    description: "Solicitudes de 'Arma tu Proyecto', adjuntos y cotizaciones.",
    href: "/admin/proyectos",
    icon: FolderKanban,
  },
  {
    title: "Catálogo de Productos",
    description: "Administra productos, categorías y contenido del catálogo.",
    href: "/admin/catalogo",
    icon: PackageSearch,
  },
  {
    title: "Guía del administrador",
    description: "Tutorial paso a paso para registrar categorías y productos correctamente.",
    href: "/admin/guia",
    icon: BookOpen,
  },
  {
    title: "Certificados",
    description: "Gestiona certificados de calidad y análisis.",
    href: "/admin/certificados",
    icon: Award,
  },
  {
    title: "Configuración DNA 3D",
    description: "Personaliza la hélice de ADN del hero section.",
    href: "/admin/dna-config",
    icon: Dna,
  },
];

export default function AdminHome() {
  const { user, profile } = useAuth();
  const displayName = profile?.full_name || user?.email || "Administrador";

  return (
    <div className="min-h-screen relative py-24 px-4">
      <Seo title="Admin | T4" description="Panel administrativo." noindex />
      <NucleotideBackground />
      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Bienvenido, {displayName}
          </h1>
          <p className="text-muted-foreground mt-1">Panel de administración T4</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {adminLinks.map((link) => (
            <Link key={link.href} to={link.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-border hover:border-primary/40">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <link.icon className="h-6 w-6 text-primary shrink-0" />
                  <CardTitle className="text-lg">{link.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{link.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
