import { useState, useRef, useEffect } from "react";
import { Send, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSiteAssistant } from "@/hooks/useSiteAssistant";
import { PabloMessage } from "./PabloMessage";
import pabloIcon from "@/assets/pablo-ai.png";

interface PabloModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SUGGESTIONS = [
  "¿Qué sondas qPCR ofrecen?",
  "¿Cómo solicito un certificado de análisis?",
  "¿Qué servicios CRO tienen?",
  "¿Cómo armo mi proyecto?",
];

export function PabloModal({ open, onOpenChange }: PabloModalProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, isLoading, sendMessage, clearMessages } = useSiteAssistant();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl h-[85vh] sm:h-[640px] flex flex-col p-0 gap-0">
        <DialogHeader className="p-5 pb-4 border-b">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src={pabloIcon} alt="Pablo" className="w-10 h-10 object-contain" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base text-left">Pablo · Asistente T4</DialogTitle>
                <DialogDescription className="text-xs text-left">
                  Pregúntale sobre productos, servicios, calidad o cómo armar tu proyecto
                </DialogDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearMessages}
              title="Limpiar conversación"
              className="flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <PabloMessage
                key={message.id}
                message={message}
                onLinkClick={() => onOpenChange(false)}
              />
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
                <Loader2 className="h-4 w-4 animate-spin" />
                Pensando...
              </div>
            )}

            {messages.length === 1 && !isLoading && (
              <div className="space-y-2 mt-4">
                <p className="text-xs text-muted-foreground">Prueba con estas preguntas:</p>
                {SUGGESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    disabled={isLoading}
                    className="block w-full text-left text-sm p-3 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()} className="bg-primary hover:bg-primary/90">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
