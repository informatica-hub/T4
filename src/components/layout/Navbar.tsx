import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import logo from "@/assets/logotipo-t4.png";
import pabloIcon from "@/assets/pablo-ai.png";
import { UserMenu } from "./UserMenu";
import { useUserRole } from "@/hooks/useUserRole";
import { PabloModal } from "@/components/ai/PabloModal";

const products = [
  { title: "ListOligo", href: "/productos/listoligo", description: "Oligos presintetizados listos para envío" },
  { title: "Oligonucleótidos", href: "/productos/oligonucleotidos", description: "Síntesis personalizada de alta calidad" },
  { title: "Sondas qPCR", href: "/productos/sondas-qpcr", description: "Para PCR en tiempo real" },
  { title: "Síntesis RNA", href: "/productos/sintesis-rna", description: "Producción de ARN personalizado" },
];

const services = [
  { title: "Secuenciación Genética", href: "/servicios/secuenciacion-genetica", description: "Servicios de secuenciación de alta calidad" },
  { title: "Servicios Especializados", href: "/servicios/servicios-especializados", description: "Soluciones analíticas a medida" },
  { title: "Soluciones CRO", href: "/servicios/soluciones-cro", description: "Investigación por contrato e infraestructura" },
];

const productLinks = [
  { title: "Modificaciones Químicas", href: "/productos/modificaciones-quimicas", description: "100+ modificaciones en oligonucleótidos" },
  { title: "Mapa Espectral StarQ™", href: "/productos/mapa-espectral", description: "Fluoróforos para sondas qPCR" },
  { title: "Genes y Controles Sintéticos", href: "/productos/genes-controles-sinteticos", description: "Controles de referencia certificados" },
  { title: "Innovaciones", href: "/productos/innovaciones", description: "MIKE™, 4BOND™ y metodología StarQ™" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [pabloOpen, setPabloOpen] = useState(false);
  const location = useLocation();
  const { isAdmin } = useUserRole();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50">
      <nav className="container-width px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="T4" className="h-10 md:h-12 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link 
                    to="/nosotros" 
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive("/nosotros") ? "text-primary" : "text-foreground"
                    )}
                  >
                    Nosotros
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link 
                    to="/productos" 
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                      location.pathname.startsWith("/productos") ? "text-primary" : "text-foreground"
                    )}
                  >
                    Productos
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Servicios</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                      <div>
                        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Servicios</div>
                        <ul className="grid gap-2">
                          {services.map((service) => (
                            <li key={service.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={service.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">{service.title}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{service.description}</p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Productos</div>
                        <ul className="grid gap-2">
                          {productLinks.map((product) => (
                            <li key={product.title}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={product.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">{product.title}</div>
                                  <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{product.description}</p>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className="bg-transparent">Calidad</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-2 p-4">
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/calidad"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Calidad y Certificaciones</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Estándares y acreditaciones</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                      <li>
                        <NavigationMenuLink asChild>
                          <Link
                            to="/certificados"
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">Certificados</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">Consulta tus certificados de análisis</p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link 
                    to="/faq" 
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive("/faq") ? "text-primary" : "text-foreground"
                    )}
                  >
                    FAQ
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link 
                    to="/contacto" 
                    className={cn(
                      "px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive("/contacto") ? "text-primary" : "text-foreground"
                    )}
                  >
                    Contacto
                  </Link>
                </NavigationMenuItem>
                {isAdmin && (
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 bg-transparent",
                        location.pathname.startsWith("/admin") ? "text-primary" : "text-foreground"
                      )}
                    >
                      <Settings className="h-4 w-4" />
                      Admin
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[220px] gap-1 p-2">
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/admin/catalogo"
                              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-sm"
                            >
                              Catálogo
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/admin/certificados"
                              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-sm"
                            >
                              Certificados
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/admin/proyectos"
                              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-sm"
                            >
                              Proyectos
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/admin/dna-config"
                              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-sm"
                            >
                              DNA Config
                            </Link>
                          </NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink asChild>
                            <Link
                              to="/admin/wallet"
                              className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground text-sm"
                            >
                              Monedero Electrónico
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                )}

              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* User Menu & CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPabloOpen(true)}
              className="gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
            >
              <img src={pabloIcon} alt="" className="h-5 w-5 object-contain" />
              Pregunta a Pablo
            </Button>
            <Link to="/carrito">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Arma tu Proyecto
              </Button>
            </Link>
            <UserMenu />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-2">
              <Link 
                to="/nosotros"
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Nosotros
              </Link>
              
              <Link 
                to="/productos"
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Productos
              </Link>

              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Servicios
                </div>
                {services.map((service) => (
                  <Link
                    key={service.title}
                    to={service.href}
                    className="block py-2 pl-4 text-sm hover:text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    {service.title}
                  </Link>
                ))}
              </div>

              <div className="px-4 py-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Calidad
                </div>
                <Link
                  to="/calidad"
                  className="block py-2 pl-4 text-sm hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Calidad y Certificaciones
                </Link>
                <Link
                  to="/certificados"
                  className="block py-2 pl-4 text-sm hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Certificados
                </Link>
              </div>
              <Link 
                to="/faq" 
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
                onClick={() => setIsOpen(false)}
              >
                FAQ
              </Link>
              <Link 
                to="/contacto" 
                className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Contacto
              </Link>

              <div className="flex flex-col gap-2 px-4 pt-4 border-t border-border/50">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    setPabloOpen(true);
                  }}
                  className="w-full gap-2 border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                >
                  <img src={pabloIcon} alt="" className="h-5 w-5 object-contain" />
                  Pregunta a Pablo
                </Button>
                <Link to="/carrito" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Arma tu Proyecto
                  </Button>
                </Link>
                <div className="flex justify-center pt-2">
                  <UserMenu />
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      <PabloModal open={pabloOpen} onOpenChange={setPabloOpen} />
    </header>
  );
}
