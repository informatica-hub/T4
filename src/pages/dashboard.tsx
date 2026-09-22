import { useAuth } from "@/contexts/AuthContext";
import { useWallet } from "@/hooks/useWallet";
import { BalanceCard } from "@/components/wallet/BalanceCard";
import { MovementsTable } from "@/components/wallet/MovementsTable";
import { NucleotideBackground } from "@/components/ui/NucleotideBackground";
import { Seo } from "@/components/seo/Seo";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { movements, balance, loading } = useWallet();

  if (!user) {
    return <div className="text-center py-12">Inicia sesión para ver tu monedero.</div>;
  }

  return (
    <div className="min-h-screen relative py-24 px-4">
      <Seo title="Mi Monedero | T4" description="Consulta tu saldo y movimientos." />
      <NucleotideBackground />
      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Monedero</h1>
          <p className="text-muted-foreground mt-1">
            Aquí puedes ver tu saldo y el historial de movimientos.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <BalanceCard balance={balance} />
            <div>
              <h2 className="text-xl font-semibold mb-4">Historial de movimientos</h2>
              <MovementsTable movements={movements} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}