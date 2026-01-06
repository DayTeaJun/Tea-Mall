export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      cart_items: {
        Row: {
          created_at: string | null;
          id: string;
          options: Json | null;
          product_id: string;
          quantity: number;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          options?: Json | null;
          product_id: string;
          quantity?: number;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          options?: Json | null;
          product_id?: string;
          quantity?: number;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      favorites: {
        Row: {
          created_at: string;
          metadata: Json | null;
          product_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          metadata?: Json | null;
          product_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          metadata?: Json | null;
          product_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favorites_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "public_user_profile";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "favorites_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_table";
            referencedColumns: ["id"];
          },
        ];
      };
      order_items: {
        Row: {
          delivery_status: string | null;
          id: string;
          order_id: string;
          price: number;
          product_id: string;
          quantity: number;
          size: string | null;
        };
        Insert: {
          delivery_status?: string | null;
          id?: string;
          order_id: string;
          price: number;
          product_id: string;
          quantity: number;
          size?: string | null;
        };
        Update: {
          delivery_status?: string | null;
          id?: string;
          order_id?: string;
          price?: number;
          product_id?: string;
          quantity?: number;
          size?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders_with_user_info";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: {
          created_at: string | null;
          deleted: boolean | null;
          deleted_at: string | null;
          detail_address: string | null;
          id: string;
          receiver: string | null;
          request: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          deleted?: boolean | null;
          deleted_at?: string | null;
          detail_address?: string | null;
          id?: string;
          receiver?: string | null;
          request?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          deleted?: boolean | null;
          deleted_at?: string | null;
          detail_address?: string | null;
          id?: string;
          receiver?: string | null;
          request?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "public_user_profile";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_table";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: {
          created_at: string | null;
          id: string;
          image_url: string;
          product_id: string;
          sort_order: number | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          image_url: string;
          product_id: string;
          sort_order?: number | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          image_url?: string;
          product_id?: string;
          sort_order?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      products: {
        Row: {
          category: string | null;
          color: string | null;
          created_at: string | null;
          deleted: boolean;
          deleted_at: string | null;
          description: string | null;
          gender: string | null;
          id: string;
          image_url: string | null;
          name: string;
          price: number;
          rating_map: Json | null;
          stock_by_size: Json | null;
          subcategory: string | null;
          tags: string[] | null;
          total_stock: number | null;
          updated_at: string | null;
          user_id: string | null;
          views: number;
        };
        Insert: {
          category?: string | null;
          color?: string | null;
          created_at?: string | null;
          deleted?: boolean;
          deleted_at?: string | null;
          description?: string | null;
          gender?: string | null;
          id?: string;
          image_url?: string | null;
          name: string;
          price: number;
          rating_map?: Json | null;
          stock_by_size?: Json | null;
          subcategory?: string | null;
          tags?: string[] | null;
          total_stock?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
          views?: number;
        };
        Update: {
          category?: string | null;
          color?: string | null;
          created_at?: string | null;
          deleted?: boolean;
          deleted_at?: string | null;
          description?: string | null;
          gender?: string | null;
          id?: string;
          image_url?: string | null;
          name?: string;
          price?: number;
          rating_map?: Json | null;
          stock_by_size?: Json | null;
          subcategory?: string | null;
          tags?: string[] | null;
          total_stock?: number | null;
          updated_at?: string | null;
          user_id?: string | null;
          views?: number;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          content: string;
          created_at: string | null;
          id: string;
          images: string[] | null;
          product_id: string;
          rating: number;
          updated_at: string | null;
          user_id: string;
          user_name: string;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: string;
          images?: string[] | null;
          product_id: string;
          rating: number;
          updated_at?: string | null;
          user_id: string;
          user_name?: string;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: string;
          images?: string[] | null;
          product_id?: string;
          rating?: number;
          updated_at?: string | null;
          user_id?: string;
          user_name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "public_user_profile";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_table";
            referencedColumns: ["id"];
          },
        ];
      };
      user_table: {
        Row: {
          address: string;
          address1: string | null;
          address2: string | null;
          created_at: string | null;
          email: string | null;
          id: string;
          level: number | null;
          phone: string;
          postal_code: string | null;
          profile_image_url: string | null;
          updated_at: string | null;
          user_name: string | null;
        };
        Insert: {
          address?: string;
          address1?: string | null;
          address2?: string | null;
          created_at?: string | null;
          email?: string | null;
          id: string;
          level?: number | null;
          phone?: string;
          postal_code?: string | null;
          profile_image_url?: string | null;
          updated_at?: string | null;
          user_name?: string | null;
        };
        Update: {
          address?: string;
          address1?: string | null;
          address2?: string | null;
          created_at?: string | null;
          email?: string | null;
          id?: string;
          level?: number | null;
          phone?: string;
          postal_code?: string | null;
          profile_image_url?: string | null;
          updated_at?: string | null;
          user_name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      orders_with_user_info: {
        Row: {
          created_at: string | null;
          deleted: boolean | null;
          email: string | null;
          id: string | null;
          product_names: string | null;
          user_id: string | null;
          user_name: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "public_user_profile";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "orders_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "user_table";
            referencedColumns: ["id"];
          },
        ];
      };
      public_user_profile: {
        Row: {
          profile_image_url: string | null;
          user_id: string | null;
        };
        Insert: {
          profile_image_url?: string | null;
          user_id?: string | null;
        };
        Update: {
          profile_image_url?: string | null;
          user_id?: string | null;
        };
        Relationships: [];
      };
      public_usernames: {
        Row: {
          user_name: string | null;
        };
        Insert: {
          user_name?: string | null;
        };
        Update: {
          user_name?: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      increment_product_views: { Args: { p_id: string }; Returns: number };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
