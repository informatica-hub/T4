import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BalanceCardProps {
  balance: number;
}

export function BalanceCard({ balance }: BalanceCardProps) {
  return (
    <Card className="border-2 border-sage/20 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Saldo actual
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-sage">
          ${balance.toFixed(2)}
        </div>
      </CardContent>
    </Card>
  );
}