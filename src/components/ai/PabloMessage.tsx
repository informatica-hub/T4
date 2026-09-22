import ReactMarkdown from "react-markdown";
import { User } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import pabloIcon from "@/assets/pablo-ai.png";
import type { Message } from "@/hooks/useSiteAssistant";

interface PabloMessageProps {
  message: Message;
  onLinkClick?: () => void;
}

export function PabloMessage({ message, onLinkClick }: PabloMessageProps) {
  const isAssistant = message.role === "assistant";

  return (
    <div className={cn("flex gap-3 p-4 rounded-lg", isAssistant ? "bg-muted/50" : "bg-primary/5")}>
      <div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center overflow-hidden",
          isAssistant ? "bg-primary/10" : "bg-secondary",
        )}
      >
        {isAssistant ? (
          <img src={pabloIcon} alt="Pablo" className="w-8 h-8 object-contain" />
        ) : (
          <User className="h-4 w-4" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-xs text-muted-foreground mb-1">{isAssistant ? "Pablo" : "Tú"}</div>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 mb-2">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 mb-2">{children}</ol>,
              li: ({ children }) => <li className="mb-1">{children}</li>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              code: ({ children }) => (
                <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>
              ),
              a: ({ href, children }) => {
                const url = href ?? "";
                const isInternal = url.startsWith("/");
                if (isInternal) {
                  return (
                    <Link
                      to={url}
                      onClick={onLinkClick}
                      className="text-primary font-medium underline underline-offset-2 hover:text-primary/80"
                    >
                      {children}
                    </Link>
                  );
                }
                return (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary font-medium underline underline-offset-2 hover:text-primary/80"
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
