export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accessibility_issues: {
        Row: {
          ai_explanation: string | null
          ai_fix_suggestion: string | null
          analyzed_at: string | null
          created_at: string
          description: string
          help_text: string | null
          help_url: string | null
          html_snippet: string | null
          id: string
          impact: string
          rule_id: string
          scan_result_id: string
          target_element: string | null
          wcag_guideline: string | null
          wcag_level: string | null
          wcag_principle: string | null
          wcag_reference: string | null
        }
        Insert: {
          ai_explanation?: string | null
          ai_fix_suggestion?: string | null
          analyzed_at?: string | null
          created_at?: string
          description: string
          help_text?: string | null
          help_url?: string | null
          html_snippet?: string | null
          id?: string
          impact: string
          rule_id: string
          scan_result_id: string
          target_element?: string | null
          wcag_guideline?: string | null
          wcag_level?: string | null
          wcag_principle?: string | null
          wcag_reference?: string | null
        }
        Update: {
          ai_explanation?: string | null
          ai_fix_suggestion?: string | null
          analyzed_at?: string | null
          created_at?: string
          description?: string
          help_text?: string | null
          help_url?: string | null
          html_snippet?: string | null
          id?: string
          impact?: string
          rule_id?: string
          scan_result_id?: string
          target_element?: string | null
          wcag_guideline?: string | null
          wcag_level?: string | null
          wcag_principle?: string | null
          wcag_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accessibility_issues_scan_result_id_fkey"
            columns: ["scan_result_id"]
            isOneToOne: false
            referencedRelation: "scan_results"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_results: {
        Row: {
          created_at: string
          critical_issues: number | null
          id: string
          load_time_ms: number | null
          minor_issues: number | null
          moderate_issues: number | null
          scan_id: string
          screenshot_url: string | null
          serious_issues: number | null
          status_code: number | null
          title: string | null
          total_issues: number | null
          url: string
        }
        Insert: {
          created_at?: string
          critical_issues?: number | null
          id?: string
          load_time_ms?: number | null
          minor_issues?: number | null
          moderate_issues?: number | null
          scan_id: string
          screenshot_url?: string | null
          serious_issues?: number | null
          status_code?: number | null
          title?: string | null
          total_issues?: number | null
          url: string
        }
        Update: {
          created_at?: string
          critical_issues?: number | null
          id?: string
          load_time_ms?: number | null
          minor_issues?: number | null
          moderate_issues?: number | null
          scan_id?: string
          screenshot_url?: string | null
          serious_issues?: number | null
          status_code?: number | null
          title?: string | null
          total_issues?: number | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "scan_results_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scans"
            referencedColumns: ["id"]
          },
        ]
      }
      scans: {
        Row: {
          completed_at: string | null
          created_at: string
          error_message: string | null
          id: string
          scanned_pages: number | null
          started_at: string | null
          status: string
          total_issues: number | null
          total_pages: number | null
          website_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          scanned_pages?: number | null
          started_at?: string | null
          status?: string
          total_issues?: number | null
          total_pages?: number | null
          website_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          scanned_pages?: number | null
          started_at?: string | null
          status?: string
          total_issues?: number | null
          total_pages?: number | null
          website_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scans_website_id_fkey"
            columns: ["website_id"]
            isOneToOne: false
            referencedRelation: "websites"
            referencedColumns: ["id"]
          },
        ]
      }
      websites: {
        Row: {
          base_url: string
          created_at: string
          id: string
          max_depth: number | null
          max_pages: number | null
          name: string
          rate_limit_ms: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          base_url: string
          created_at?: string
          id?: string
          max_depth?: number | null
          max_pages?: number | null
          name: string
          rate_limit_ms?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          base_url?: string
          created_at?: string
          id?: string
          max_depth?: number | null
          max_pages?: number | null
          name?: string
          rate_limit_ms?: number | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
