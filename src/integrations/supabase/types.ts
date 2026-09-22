export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      blocked_ips: {
        Row: {
          attempts: number | null
          blocked_at: string | null
          ip_address: string
          last_attempt: string | null
          reason: string | null
        }
        Insert: {
          attempts?: number | null
          blocked_at?: string | null
          ip_address: string
          last_attempt?: string | null
          reason?: string | null
        }
        Update: {
          attempts?: number | null
          blocked_at?: string | null
          ip_address?: string
          last_attempt?: string | null
          reason?: string | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          product_name: string
          quantity: number
          specifications: Json | null
          unit_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          product_name: string
          quantity?: number
          specifications?: Json | null
          unit_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          specifications?: Json | null
          unit_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      catalog_products: {
        Row: {
          applications: string[] | null
          brand: string
          catalog_number: string | null
          category_id: string | null
          created_at: string
          cta: string | null
          delivery_time: string | null
          description: string | null
          differentiator: string | null
          featured: boolean
          href: string | null
          id: string
          image_url: string | null
          list_price: number | null
          long_description: string | null
          name: string
          presentations: string | null
          product_type: string
          ruo: boolean
          sku: string | null
          slogan: string | null
          subcategory: string | null
          subcategory_id: string | null
          tags: string[] | null
          updated_at: string
          upselling: string[] | null
        }
        Insert: {
          applications?: string[] | null
          brand?: string
          catalog_number?: string | null
          category_id?: string | null
          created_at?: string
          cta?: string | null
          delivery_time?: string | null
          description?: string | null
          differentiator?: string | null
          featured?: boolean
          href?: string | null
          id?: string
          image_url?: string | null
          list_price?: number | null
          long_description?: string | null
          name: string
          presentations?: string | null
          product_type?: string
          ruo?: boolean
          sku?: string | null
          slogan?: string | null
          subcategory?: string | null
          subcategory_id?: string | null
          tags?: string[] | null
          updated_at?: string
          upselling?: string[] | null
        }
        Update: {
          applications?: string[] | null
          brand?: string
          catalog_number?: string | null
          category_id?: string | null
          created_at?: string
          cta?: string | null
          delivery_time?: string | null
          description?: string | null
          differentiator?: string | null
          featured?: boolean
          href?: string | null
          id?: string
          image_url?: string | null
          list_price?: number | null
          long_description?: string | null
          name?: string
          presentations?: string | null
          product_type?: string
          ruo?: boolean
          sku?: string | null
          slogan?: string | null
          subcategory?: string | null
          subcategory_id?: string | null
          tags?: string[] | null
          updated_at?: string
          upselling?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "catalog_products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "catalog_products_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "product_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          certificate_type: string
          created_at: string
          downloaded_at: string | null
          expires_at: string | null
          file_path: string | null
          id: string
          issued_at: string
          lot_number: string | null
          order_id: string
          product_id: string
          product_name: string
          status: string
          user_id: string
        }
        Insert: {
          certificate_type?: string
          created_at?: string
          downloaded_at?: string | null
          expires_at?: string | null
          file_path?: string | null
          id?: string
          issued_at?: string
          lot_number?: string | null
          order_id: string
          product_id: string
          product_name: string
          status?: string
          user_id: string
        }
        Update: {
          certificate_type?: string
          created_at?: string
          downloaded_at?: string | null
          expires_at?: string | null
          file_path?: string | null
          id?: string
          issued_at?: string
          lot_number?: string | null
          order_id?: string
          product_id?: string
          product_name?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      movimientos: {
        Row: {
          created_at: string | null
          created_by: string | null
          descripcion: string | null
          id: number
          monto: number
          tipo: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          id?: number
          monto: number
          tipo: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          descripcion?: string | null
          id?: number
          monto?: number
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          discount_amount: number | null
          id: string
          items: Json
          notes: string | null
          order_number: string
          status: string
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          discount_amount?: number | null
          id?: string
          items?: Json
          notes?: string | null
          order_number: string
          status?: string
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          discount_amount?: number | null
          id?: string
          items?: Json
          notes?: string | null
          order_number?: string
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pedidos: {
        Row: {
          created_at: string
          email: string
          id: string
          institution: string
          laboratory: string
          notes: string | null
          products: Json
          status: string
          trigger_product_id: string | null
          trigger_product_name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          institution: string
          laboratory: string
          notes?: string | null
          products?: Json
          status?: string
          trigger_product_id?: string | null
          trigger_product_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          institution?: string
          laboratory?: string
          notes?: string | null
          products?: Json
          status?: string
          trigger_product_id?: string | null
          trigger_product_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          color: string
          created_at: string
          icon_url: string | null
          id: string
          name: string
          slug: string
          sort_order: number
        }
        Insert: {
          color?: string
          created_at?: string
          icon_url?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
        }
        Update: {
          color?: string
          created_at?: string
          icon_url?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
        }
        Relationships: []
      }
      product_subcategories: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      project_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          id: string
          kind: string
          mime_type: string | null
          project_request_id: string
          size_bytes: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          kind?: string
          mime_type?: string | null
          project_request_id: string
          size_bytes?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          kind?: string
          mime_type?: string | null
          project_request_id?: string
          size_bytes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      project_requests: {
        Row: {
          created_at: string
          email: string
          id: string
          institution: string
          laboratory: string
          notes: string | null
          products: Json
          status: string
          trigger_product_id: string | null
          trigger_product_name: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          institution: string
          laboratory: string
          notes?: string | null
          products?: Json
          status?: string
          trigger_product_id?: string | null
          trigger_product_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          institution?: string
          laboratory?: string
          notes?: string | null
          products?: Json
          status?: string
          trigger_product_id?: string | null
          trigger_product_name?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_certificate_by_id: {
        Args: { _cert_id: string }
        Returns: {
          certificate_type: string
          file_path: string
          id: string
          lot_number: string
          product_name: string
          status: string
        }[]
      }
      get_saldo: { Args: { p_user_id: string }; Returns: number }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      mark_certificate_downloaded: {
        Args: { _cert_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
