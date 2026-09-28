import { ArrowRight, Megaphone } from "lucide-react";
import { Campaign } from "@/types/campaign";

export function CampaignsPanel({ campaigns }: { campaigns: Campaign[] }) {
  if (campaigns.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        No hay promociones activas por ahora.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Megaphone className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Promociones y novedades</h2>
      </div>

      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-border" />
        <div className="space-y-5">
          {campaigns.map((c) => (
            <div key={c.id} className="relative">
              <div className="absolute -left-[18px] top-4 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
              <div className="rounded-lg border overflow-hidden bg-background">
                <img src={c.image_url} alt={c.title} className="w-full h-auto object-cover" />
                <div className="p-3 space-y-1">
                  <h3 className="font-semibold text-sm">{c.title}</h3>
                  {c.description && (
                    <p className="text-sm text-muted-foreground">{c.description}</p>
                  )}
                  {c.cta_link && (
                    <a
                      href={c.cta_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-sm text-primary hover:underline"
                    >
                      {c.cta_text ?? "Ver más"}
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}