// AUTO-GENERATED from the LIVE Supabase project (public schema).
// Source of truth: production database. Do NOT hand-edit.
// Regenerate via the Supabase type generator against the production project.
// Generated for Checkpoint 1 (feat/admin-content-import). Contains NO data rows or secrets.

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
      answer_choices: {
        Row: {
          answer_key: string | null
          id: string
          question_id: string
          sort_order: number | null
        }
        Insert: {
          answer_key?: string | null
          id: string
          question_id: string
          sort_order?: number | null
        }
        Update: {
          answer_key?: string | null
          id?: string
          question_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "answer_choices_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      block_translations: {
        Row: {
          alt_text: string | null
          block_id: string
          caption: string | null
          content_json: Json | null
          id: string
          language_code: string
        }
        Insert: {
          alt_text?: string | null
          block_id: string
          caption?: string | null
          content_json?: Json | null
          id: string
          language_code: string
        }
        Update: {
          alt_text?: string | null
          block_id?: string
          caption?: string | null
          content_json?: Json | null
          id?: string
          language_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "block_translations_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "lesson_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      choice_translations: {
        Row: {
          answer_choice_id: string
          answer_text: string | null
          id: string
          language_code: string
        }
        Insert: {
          answer_choice_id: string
          answer_text?: string | null
          id: string
          language_code: string
        }
        Update: {
          answer_choice_id?: string
          answer_text?: string | null
          id?: string
          language_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "choice_translations_answer_choice_id_fkey"
            columns: ["answer_choice_id"]
            isOneToOne: false
            referencedRelation: "answer_choices"
            referencedColumns: ["id"]
          },
        ]
      }
      course_entitlements: {
        Row: {
          amount_cents: number | null
          course_id: string
          created_at: string
          currency: string | null
          id: string
          source: string
          stripe_session_id: string | null
          user_id: string
        }
        Insert: {
          amount_cents?: number | null
          course_id: string
          created_at?: string
          currency?: string | null
          id?: string
          source?: string
          stripe_session_id?: string | null
          user_id: string
        }
        Update: {
          amount_cents?: number | null
          course_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          source?: string
          stripe_session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_entitlements_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lesson_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          id: string
          lesson_id: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          lesson_id: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          id?: string
          lesson_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      course_quiz_attempts: {
        Row: {
          completed_at: string
          course_id: string
          id: string
          passed: boolean
          percentage: number
          practice_test_id: string | null
          score: number
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          course_id: string
          id?: string
          passed: boolean
          percentage: number
          practice_test_id?: string | null
          score: number
          total_questions: number
          user_id: string
        }
        Update: {
          completed_at?: string
          course_id?: string
          id?: string
          passed?: boolean
          percentage?: number
          practice_test_id?: string | null
          score?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_quiz_attempts_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_quiz_attempts_practice_test_id_fkey"
            columns: ["practice_test_id"]
            isOneToOne: false
            referencedRelation: "practice_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      course_translations: {
        Row: {
          course_id: string
          id: string
          language_code: string
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          title: string | null
        }
        Insert: {
          course_id: string
          id: string
          language_code: string
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          title?: string | null
        }
        Update: {
          course_id?: string
          id?: string
          language_code?: string
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_translations_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          course_type: string | null
          estimated_minutes: number | null
          id: string
          is_free: boolean | null
          passing_score: number | null
          price_cents: number
          slug: string
          sort_order: number | null
          status: string | null
          thumbnail_path: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          category?: string | null
          course_type?: string | null
          estimated_minutes?: number | null
          id: string
          is_free?: boolean | null
          passing_score?: number | null
          price_cents?: number
          slug: string
          sort_order?: number | null
          status?: string | null
          thumbnail_path?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          category?: string | null
          course_type?: string | null
          estimated_minutes?: number | null
          id?: string
          is_free?: boolean | null
          passing_score?: number | null
          price_cents?: number
          slug?: string
          sort_order?: number | null
          status?: string | null
          thumbnail_path?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: []
      }
      ebook_purchases: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          download_token: string | null
          ebook_slug: string
          granted_by: string | null
          id: string
          language: string | null
          payer_email: string | null
          status: string
          stripe_session_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          download_token?: string | null
          ebook_slug: string
          granted_by?: string | null
          id?: string
          language?: string | null
          payer_email?: string | null
          status?: string
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          download_token?: string | null
          ebook_slug?: string
          granted_by?: string | null
          id?: string
          language?: string | null
          payer_email?: string | null
          status?: string
          stripe_session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          kit_subscriber_id: string | null
          language: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id?: string
          kit_subscriber_id?: string | null
          language?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          kit_subscriber_id?: string | null
          language?: string | null
        }
        Relationships: []
      }
      lesson_blocks: {
        Row: {
          block_key: string | null
          block_type: string | null
          content_json: Json | null
          id: string
          lesson_id: string
          media_asset_id: string | null
          sort_order: number | null
          status: string | null
        }
        Insert: {
          block_key?: string | null
          block_type?: string | null
          content_json?: Json | null
          id: string
          lesson_id: string
          media_asset_id?: string | null
          sort_order?: number | null
          status?: string | null
        }
        Update: {
          block_key?: string | null
          block_type?: string | null
          content_json?: Json | null
          id?: string
          lesson_id?: string
          media_asset_id?: string | null
          sort_order?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_blocks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_translations: {
        Row: {
          id: string
          language_code: string
          learning_objectives: string | null
          lesson_id: string
          summary: string | null
          title: string | null
        }
        Insert: {
          id: string
          language_code: string
          learning_objectives?: string | null
          lesson_id: string
          summary?: string | null
          title?: string | null
        }
        Update: {
          id?: string
          language_code?: string
          learning_objectives?: string | null
          lesson_id?: string
          summary?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_translations_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          estimated_minutes: number | null
          id: string
          is_preview: boolean | null
          lesson_key: string | null
          lesson_type: string | null
          section_id: string
          sort_order: number | null
          status: string | null
          version: string | null
        }
        Insert: {
          estimated_minutes?: number | null
          id: string
          is_preview?: boolean | null
          lesson_key?: string | null
          lesson_type?: string | null
          section_id: string
          sort_order?: number | null
          status?: string | null
          version?: string | null
        }
        Update: {
          estimated_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          lesson_key?: string | null
          lesson_type?: string | null
          section_id?: string
          sort_order?: number | null
          status?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      media_assets: {
        Row: {
          alt_text_en: string | null
          alt_text_es: string | null
          asset_key: string | null
          asset_type: string | null
          course_id: string | null
          downloadable: boolean | null
          id: string
          language_code: string | null
          mime_type: string | null
          offline_allowed: boolean | null
          status: string | null
          storage_bucket: string | null
          storage_path: string | null
        }
        Insert: {
          alt_text_en?: string | null
          alt_text_es?: string | null
          asset_key?: string | null
          asset_type?: string | null
          course_id?: string | null
          downloadable?: boolean | null
          id: string
          language_code?: string | null
          mime_type?: string | null
          offline_allowed?: boolean | null
          status?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
        }
        Update: {
          alt_text_en?: string | null
          alt_text_es?: string | null
          asset_key?: string | null
          asset_type?: string | null
          course_id?: string | null
          downloadable?: boolean | null
          id?: string
          language_code?: string | null
          mime_type?: string | null
          offline_allowed?: boolean | null
          status?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_assets_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      page_views: {
        Row: {
          country: string | null
          created_at: string
          id: string
          path: string
          referrer: string | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          path: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          path?: string
          referrer?: string | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      practice_test_questions: {
        Row: {
          id: string
          practice_test_id: string
          question_id: string
          sort_order: number | null
          weight: number | null
        }
        Insert: {
          id: string
          practice_test_id: string
          question_id: string
          sort_order?: number | null
          weight?: number | null
        }
        Update: {
          id?: string
          practice_test_id?: string
          question_id?: string
          sort_order?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_test_questions_practice_test_id_fkey"
            columns: ["practice_test_id"]
            isOneToOne: false
            referencedRelation: "practice_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "practice_test_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_tests: {
        Row: {
          course_id: string
          id: string
          passing_score: number | null
          question_count: number | null
          selection_mode: string | null
          status: string | null
          test_key: string | null
          test_type: string | null
          time_limit_minutes: number | null
        }
        Insert: {
          course_id: string
          id: string
          passing_score?: number | null
          question_count?: number | null
          selection_mode?: string | null
          status?: string | null
          test_key?: string | null
          test_type?: string | null
          time_limit_minutes?: number | null
        }
        Update: {
          course_id?: string
          id?: string
          passing_score?: number | null
          question_count?: number | null
          selection_mode?: string | null
          status?: string | null
          test_key?: string | null
          test_type?: string | null
          time_limit_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "practice_tests_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      question_translations: {
        Row: {
          explanation: string | null
          id: string
          language_code: string
          question_id: string
          question_text: string | null
          study_reference: string | null
        }
        Insert: {
          explanation?: string | null
          id: string
          language_code: string
          question_id: string
          question_text?: string | null
          study_reference?: string | null
        }
        Update: {
          explanation?: string | null
          id?: string
          language_code?: string
          question_id?: string
          question_text?: string | null
          study_reference?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_translations_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct_answer_key: string | null
          course_id: string
          difficulty: string | null
          id: string
          lesson_id: string | null
          question_key: string | null
          question_type: string | null
          section_id: string | null
          sort_order: number | null
          status: string | null
        }
        Insert: {
          correct_answer_key?: string | null
          course_id: string
          difficulty?: string | null
          id: string
          lesson_id?: string | null
          question_key?: string | null
          question_type?: string | null
          section_id?: string | null
          sort_order?: number | null
          status?: string | null
        }
        Update: {
          correct_answer_key?: string | null
          course_id?: string
          difficulty?: string | null
          id?: string
          lesson_id?: string | null
          question_key?: string | null
          question_type?: string | null
          section_id?: string | null
          sort_order?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      section_translations: {
        Row: {
          description: string | null
          id: string
          language_code: string
          section_id: string
          title: string | null
        }
        Insert: {
          description?: string | null
          id: string
          language_code: string
          section_id: string
          title?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          language_code?: string
          section_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "section_translations_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          course_id: string
          id: string
          section_key: string | null
          sort_order: number | null
          status: string | null
        }
        Insert: {
          course_id: string
          id: string
          section_key?: string | null
          sort_order?: number | null
          status?: string | null
        }
        Update: {
          course_id?: string
          id?: string
          section_key?: string | null
          sort_order?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          id: string
          status: string
          stripe_customer_id: string | null
          stripe_price_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          id?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_price_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
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
    Enums: {},
  },
} as const
