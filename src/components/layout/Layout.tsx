import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WhatsAppButton } from "./WhatsAppButton";
import { PartnersStrip } from "./PartnersStrip";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16 md:pt-20">
        <Outlet />
      </main>
      <PartnersStrip />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
