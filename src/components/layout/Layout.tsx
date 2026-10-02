import { Outlet, useLocation, useSearchParams  } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { PartnersStrip } from "./PartnersStrip";
import { SupportWidget } from "@/components/support";
import { useAuth } from "@/contexts/AuthContext";

export function Layout() {
  const location = useLocation();
   const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Ocultar widgets en el panel de soporte
  const isSupportPanel = location.pathname === "/admin/support";

  // ✅ Detectar si el query param `chat=open` está presente
  const shouldOpenChat = searchParams.get("chat") === "open";


  return (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16 md:pt-20">
      <Outlet />
    </main>

    {/* 👇 Ocultar aliados y footer en /admin/support */}
    {!isSupportPanel && (
      <>
        <PartnersStrip />
        <Footer />
      </>
    )}

    {!isSupportPanel && (
      <>
        {/* WhatsApp solo para visitantes (sin sesión) */}
        {!user && <WhatsAppButton />}

        {/* Chat para usuarios logueados, abriéndose si la URL lo pide */}
        <SupportWidget initialOpen={shouldOpenChat} />
      </>
    )}
  </div>
);
}