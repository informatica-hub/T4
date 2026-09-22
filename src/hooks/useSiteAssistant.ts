import { useState, useCallback } from "react";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/site-assistant`;

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "¡Hola! Soy **Pablo**, el asistente IA de T4. Puedo ayudarte con productos, servicios, calidad, certificados y a [armar tu proyecto](/carrito). ¿En qué te ayudo?",
  timestamp: new Date(),
};

export function useSiteAssistant() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      let assistantContent = "";
      const upsertAssistant = (chunk: string) => {
        assistantContent += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && last.id.startsWith("assistant-stream")) {
            return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
          }
          return [
            ...prev,
            {
              id: `assistant-stream-${Date.now()}`,
              role: "assistant" as const,
              content: assistantContent,
              timestamp: new Date(),
            },
          ];
        });
      };

      try {
        const conversationHistory = [...messages, userMessage]
          .filter((m) => m.id !== "welcome")
          .map((m) => ({ role: m.role, content: m.content }));

        const resp = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: conversationHistory }),
        });

        if (!resp.ok) {
          if (resp.status === 429) throw new Error("Límite de solicitudes excedido. Intenta en unos momentos.");
          if (resp.status === 402) throw new Error("Créditos agotados. Contacta al administrador.");
          throw new Error("Error al conectar con el asistente");
        }
        if (!resp.body) throw new Error("No se recibió respuesta");

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";
        let streamDone = false;

        while (!streamDone) {
          const { done, value } = await reader.read();
          if (done) break;
          textBuffer += decoder.decode(value, { stream: true });

          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") {
              streamDone = true;
              break;
            }
            try {
              const parsed = JSON.parse(jsonStr);
              const c = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (c) upsertAssistant(c);
            } catch {
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        if (textBuffer.trim()) {
          for (let raw of textBuffer.split("\n")) {
            if (!raw) continue;
            if (raw.endsWith("\r")) raw = raw.slice(0, -1);
            if (raw.startsWith(":") || raw.trim() === "") continue;
            if (!raw.startsWith("data: ")) continue;
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const c = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (c) upsertAssistant(c);
            } catch {
              /* ignore */
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Error desconocido";
        setError(msg);
        setMessages((prev) => [
          ...prev,
          {
            id: `error-${Date.now()}`,
            role: "assistant",
            content: `Lo siento, hubo un error: ${msg}. Por favor, intenta de nuevo.`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading],
  );

  const clearMessages = useCallback(() => {
    setMessages([WELCOME]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
