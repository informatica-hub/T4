import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation  } from "react-router-dom";
import { useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";
import Index from "./pages/Index";
import MisProyectos from "./pages/MisProyectos";
import NotFound from "./pages/NotFound";

// Importaciones para Pablo AI
import { useState } from "react";
import { PabloModal } from "./components/ai/PabloModal";
import { PabloFloatingGif } from "./components/PabloFloatingGif";

// Pages (resto igual)
import Nosotros from "./pages/Nosotros";
import Calidad from "./pages/Calidad";
import Vinculacion from "./pages/Vinculacion";
import FAQ from "./pages/FAQ";
import Contacto from "./pages/Contacto";
import Calculadora from "./pages/Calculadora";
import Certificado from "./pages/Certificado";
import Soporte from "./pages/Soporte";
import Aviso from "./pages/Aviso";
{/*import AvisoPrivacidad from "./pages/AvisoPrivacidad";*/}
{/*import TerminosCondiciones from "./pages/TerminosCondiciones"; */}
import Productos from "./pages/Productos";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Registro from "./pages/Registro";
import Carrito from "./pages/Carrito";
import Certificados from "./pages/Certificados";
import AdminHome from "./pages/admin/AdminHome";
import AdminCatalogo from "./pages/admin/Catalogo";
import GuiaAdmin from "./pages/admin/GuiaAdmin";
import DNAConfig from "./pages/admin/DNAConfig";
import AdminCertificados from "./pages/admin/Certificados";
import AdminProyectos from "./pages/admin/Proyectos";
import { AdminRoute } from "./components/layout/AdminRoute";
import Hub from './pages/Hub';
import ResetPasswordAuth from './pages/ResetPasswordAuth'
import Dashboard from "./pages/dashboard"; 
import AdminWallet from "./pages/admin/wallet";

// Products
import ListOligo from "./pages/productos/ListOligo";
import Oligonucleotidos from "./pages/productos/Oligonucleotidos";
import SondasQPCR from "./pages/productos/SondasQPCR";
import SintesisRNA from "./pages/productos/SintesisRNA";

// Services
import SecuenciacionGenetica from "./pages/servicios/SecuenciacionGenetica";
import ServiciosEspecializados from "./pages/servicios/ServiciosEspecializados";
import SolucionesCRO from "./pages/servicios/SolucionesCRO";

// Technical product pages
import ModificacionesQuimicas from "./pages/productos/ModificacionesQuimicas";
import MapaEspectral from "./pages/productos/MapaEspectral";
import GenesControlesSinteticos from "./pages/productos/GenesControlesSinteticos";
import Innovaciones from "./pages/productos/Innovaciones";
import SupportDashboard from "./pages/admin/SupportDashboard";

function ScrollToTop() {
  const {pathname} = useLocation();

  useEffect(() =>{
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; 
}

const queryClient = new QueryClient();

function App() {
  const [isPabloModalOpen, setIsPabloModalOpen] = useState(false);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ProjectProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-right" richColors />
              <BrowserRouter>
              <ScrollToTop />
                {/* Routes existentes */}
                <Routes>
                  <Route element={<Layout />}>
                    <Route path="/" element={<Index />} />
                    <Route path="/nosotros" element={<Nosotros />} />
                    <Route path="/calidad" element={<Calidad />} />
                    <Route path="/vinculacion" element={<Vinculacion />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contacto" element={<Contacto />} />
                    <Route path="/soporte" element={<Soporte />} />
                    <Route path="/aviso" element={<Aviso />} />
                    {/*<Route path="/aviso-privacidad" element={<AvisoPrivacidad />} />
                     <Route path="/terminos-condiciones" element={<TerminosCondiciones />} /> */}
                    <Route path="/hub" element={<Hub />} />
                    <Route path="/productos" element={<Productos />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/cambiar-contraseña" element={<ProtectedRoute><ResetPasswordAuth /></ProtectedRoute>} />
                    <Route path="/registro" element={<Registro />} />
                    <Route path="/carrito" element={<ProtectedRoute><Carrito /></ProtectedRoute>} />
                    <Route path="/cotizar" element={<ProtectedRoute><Carrito /></ProtectedRoute>} />
                    <Route path="/mis-proyectos" element={<ProtectedRoute><MisProyectos /></ProtectedRoute>} />
                    <Route path="/certificados" element={<ProtectedRoute><Certificados /></ProtectedRoute>} />
                    <Route path="/admin" element={<AdminRoute><AdminHome /></AdminRoute>} />
                    <Route path="/admin/catalogo" element={<AdminRoute><AdminCatalogo /></AdminRoute>} />
                    <Route path="/admin/guia" element={<AdminRoute><GuiaAdmin /></AdminRoute>} />
                    <Route path="/admin/dna-config" element={<AdminRoute><DNAConfig /></AdminRoute>} />
                    <Route path="/admin/certificados" element={<AdminRoute><AdminCertificados /></AdminRoute>} />
                    <Route path="/admin/proyectos" element={<AdminRoute><AdminProyectos /></AdminRoute>} />
                    <Route path="/admin/support" element={<AdminRoute><SupportDashboard /></AdminRoute>} />
                    <Route path="/productos/listoligo" element={<ListOligo />} />
                    <Route path="/productos/oligonucleotidos" element={<Oligonucleotidos />} />
                    <Route path="/productos/sondas-qpcr" element={<SondasQPCR />} />
                    <Route path="/productos/sintesis-rna" element={<SintesisRNA />} />
                    <Route path="/servicios/secuenciacion-genetica" element={<SecuenciacionGenetica />} />
                    <Route path="/servicios/servicios-especializados" element={<ServiciosEspecializados />} />
                    <Route path="/servicios/soluciones-cro" element={<SolucionesCRO />} />
                    <Route path="/productos/modificaciones-quimicas" element={<ModificacionesQuimicas />} />
                    <Route path="/productos/mapa-espectral" element={<MapaEspectral />} />
                    <Route path="/productos/genes-controles-sinteticos" element={<GenesControlesSinteticos />} />
                    <Route path="/productos/innovaciones" element={<Innovaciones />} />
                    <Route path="/calculadora" element={<ProtectedRoute><Calculadora /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /></ProtectedRoute>} />
                    <Route path="/admin/wallet" element={<ProtectedRoute> <AdminWallet /> </ProtectedRoute>} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>

                <PabloFloatingGif
                  onOpenModal={() => setIsPabloModalOpen(true)}
                  isModalOpen={isPabloModalOpen}
                />
                <PabloModal
                  open={isPabloModalOpen}
                  onOpenChange={setIsPabloModalOpen}
                />
              </BrowserRouter>
            </TooltipProvider>
          </ProjectProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;