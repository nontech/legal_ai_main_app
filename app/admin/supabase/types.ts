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
    PostgrestVersion: "13.0.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      case_details: {
        Row: {
          country_id: string
          created_at: string | null
          id: string
          information: Json | null
          updated_at: string | null
        }
        Insert: {
          country_id: string
          created_at?: string | null
          id?: string
          information?: Json | null
          updated_at?: string | null
        }
        Update: {
          country_id?: string
          created_at?: string | null
          id?: string
          information?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_details_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      case_type: {
        Row: {
          case_types: Json | null
          country_id: string
          created_at: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          case_types?: Json | null
          country_id: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          case_types?: Json | null
          country_id?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_type_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      charges: {
        Row: {
          case_types: Json | null
          charge_sheets: Json | null
          country_id: string
          created_at: string | null
          id: string
          responsible_courts: Json | null
          updated_at: string | null
        }
        Insert: {
          case_types?: Json | null
          charge_sheets?: Json | null
          country_id: string
          created_at?: string | null
          id?: string
          responsible_courts?: Json | null
          updated_at?: string | null
        }
        Update: {
          case_types?: Json | null
          charge_sheets?: Json | null
          country_id?: string
          created_at?: string | null
          id?: string
          responsible_courts?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "charges_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      judge: {
        Row: {
          country_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          judge_info: Json | null
          jurisdiction_id: string | null
          updated_at: string | null
        }
        Insert: {
          country_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          judge_info?: Json | null
          jurisdiction_id?: string | null
          updated_at?: string | null
        }
        Update: {
          country_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          judge_info?: Json | null
          jurisdiction_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "judge_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "judge_jurisdiction_id_fkey"
            columns: ["jurisdiction_id"]
            isOneToOne: false
            referencedRelation: "jurisdiction"
            referencedColumns: ["id"]
          },
        ]
      }
      jurisdiction: {
        Row: {
          city: string | null
          country_id: string
          court: string | null
          created_at: string | null
          id: string
          state_province: string | null
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          country_id: string
          court?: string | null
          created_at?: string | null
          id?: string
          state_province?: string | null
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          country_id?: string
          court?: string | null
          created_at?: string | null
          id?: string
          state_province?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jurisdiction_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      jury: {
        Row: {
          characteristics: Json | null
          country_id: string
          created_at: string | null
          demographics: Json | null
          id: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          characteristics?: Json | null
          country_id: string
          created_at?: string | null
          demographics?: Json | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          characteristics?: Json | null
          country_id?: string
          created_at?: string | null
          demographics?: Json | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jury_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      pretrial_process: {
        Row: {
          country_id: string
          created_at: string | null
          documents: Json | null
          id: string
          updated_at: string | null
        }
        Insert: {
          country_id: string
          created_at?: string | null
          documents?: Json | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          country_id?: string
          created_at?: string | null
          documents?: Json | null
          id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pretrial_process_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      role: {
        Row: {
          country_id: string
          created_at: string | null
          id: string
          role_types: Json | null
          updated_at: string | null
        }
        Insert: {
          country_id: string
          created_at?: string | null
          id?: string
          role_types?: Json | null
          updated_at?: string | null
        }
        Update: {
          country_id?: string
          created_at?: string | null
          id?: string
          role_types?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
