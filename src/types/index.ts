import type { Database } from './database';

export type Conversation = Database['public']['Tables']['conversations']['Row'];
export type ConversationInsert = Database['public']['Tables']['conversations']['Insert'];
export type Message = Database['public']['Tables']['messages']['Row'];
export type MessageInsert = Database['public']['Tables']['messages']['Insert'];
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];

// Tipo auxiliar para la UI (con nombre del remitente ya resuelto)
export type ChatMessage = Message & {
  senderName?: string;
  isOwn?: boolean;
};