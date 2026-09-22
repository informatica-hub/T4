import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
}

export function WhatsAppButton({ 
  phoneNumber = "524623073642",
  message = "Hola, me gustaría obtener información sobre sus productos de oligonucleótidos."
}: WhatsAppButtonProps) {
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-48 right-14 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
      aria-label="Contáctanos por WhatsApp"
    >
      <MessageCircle className="h-7 w-7 fill-current" />
      
      {/* Tooltip */}
      <span className="absolute right-full mr-3 px-3 py-2 bg-foreground text-background text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        ¿Necesitas ayuda?
      </span>

      {/* Pulse animation */}
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />
    </a>
  );
}
