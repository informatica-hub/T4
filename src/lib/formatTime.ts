// src/lib/formatTime.ts
export function formatMessageTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false, // o true si prefieres AM/PM
  });
}

// Opcional: mostrar "Ayer 14:30" o fecha completa si es de otro día
export function formatMessageTimestamp(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const time = formatMessageTime(iso);

  if (isToday) return time;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return `Ayer ${time}`;

  return `${date.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: '2-digit',
  })} ${time}`;
}