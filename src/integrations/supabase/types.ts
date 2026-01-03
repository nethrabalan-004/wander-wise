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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          category: Database["public"]["Enums"]["activity_category"]
          city_id: string
          created_at: string
          description: string | null
          duration_hours: number | null
          estimated_cost: number | null
          id: string
          image_url: string | null
          name: string
          rating: number | null
        }
        Insert: {
          category: Database["public"]["Enums"]["activity_category"]
          city_id: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          estimated_cost?: number | null
          id?: string
          image_url?: string | null
          name: string
          rating?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["activity_category"]
          city_id?: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          estimated_cost?: number | null
          id?: string
          image_url?: string | null
          name?: string
          rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      cities: {
        Row: {
          cost_index: number | null
          country: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          latitude: number
          longitude: number
          name: string
          popularity_rating: number | null
          region: string | null
        }
        Insert: {
          cost_index?: number | null
          country: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude: number
          longitude: number
          name: string
          popularity_rating?: number | null
          region?: string | null
        }
        Update: {
          cost_index?: number | null
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          latitude?: number
          longitude?: number
          name?: string
          popularity_rating?: number | null
          region?: string | null
        }
        Relationships: []
      }
      favorite_destinations: {
        Row: {
          city_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          city_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          city_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorite_destinations_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          mapbox_token: string | null
          preferred_currency: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          mapbox_token?: string | null
          preferred_currency?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          mapbox_token?: string | null
          preferred_currency?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      trip_activities: {
        Row: {
          activity_id: string
          created_at: string
          custom_cost: number | null
          id: string
          is_completed: boolean | null
          notes: string | null
          scheduled_date: string | null
          scheduled_time: string | null
          trip_stop_id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          custom_cost?: number | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          trip_stop_id: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          custom_cost?: number | null
          id?: string
          is_completed?: boolean | null
          notes?: string | null
          scheduled_date?: string | null
          scheduled_time?: string | null
          trip_stop_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_activities_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_activities_trip_stop_id_fkey"
            columns: ["trip_stop_id"]
            isOneToOne: false
            referencedRelation: "trip_stops"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_budgets: {
        Row: {
          category: Database["public"]["Enums"]["budget_category"]
          created_at: string
          id: string
          planned_amount: number | null
          spent_amount: number | null
          trip_id: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["budget_category"]
          created_at?: string
          id?: string
          planned_amount?: number | null
          spent_amount?: number | null
          trip_id: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["budget_category"]
          created_at?: string
          id?: string
          planned_amount?: number | null
          spent_amount?: number | null
          trip_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_budgets_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_stops: {
        Row: {
          arrival_date: string
          city_id: string
          created_at: string
          departure_date: string
          id: string
          notes: string | null
          order_index: number
          trip_id: string
        }
        Insert: {
          arrival_date: string
          city_id: string
          created_at?: string
          departure_date: string
          id?: string
          notes?: string | null
          order_index: number
          trip_id: string
        }
        Update: {
          arrival_date?: string
          city_id?: string
          created_at?: string
          departure_date?: string
          id?: string
          notes?: string | null
          order_index?: number
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_stops_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trip_stops_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      trips: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          end_date: string
          id: string
          is_public: boolean | null
          name: string
          share_token: string | null
          start_date: string
          total_budget: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          is_public?: boolean | null
          name: string
          share_token?: string | null
          start_date: string
          total_budget?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          is_public?: boolean | null
          name?: string
          share_token?: string | null
          start_date?: string
          total_budget?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_category:
        | "sightseeing"
        | "food"
        | "adventure"
        | "culture"
        | "nature"
        | "shopping"
        | "nightlife"
        | "relaxation"
      budget_category:
        | "transport"
        | "accommodation"
        | "activities"
        | "food"
        | "shopping"
        | "other"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      activity_category: [
        "sightseeing",
        "food",
        "adventure",
        "culture",
        "nature",
        "shopping",
        "nightlife",
        "relaxation",
      ],
      budget_category: [
        "transport",
        "accommodation",
        "activities",
        "food",
        "shopping",
        "other",
      ],
    },
  },
} as const
