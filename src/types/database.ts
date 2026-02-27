export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: "student" | "parent";
          full_name: string;
          avatar_url: string | null;
          google_refresh_token: string | null;
          google_access_token_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: "student" | "parent";
          full_name: string;
          avatar_url?: string | null;
          google_refresh_token?: string | null;
          google_access_token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "student" | "parent";
          full_name?: string;
          avatar_url?: string | null;
          google_refresh_token?: string | null;
          google_access_token_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      student_parent_links: {
        Row: {
          id: string;
          student_id: string;
          parent_id: string;
          status: "pending" | "accepted" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          parent_id: string;
          status?: "pending" | "accepted" | "rejected";
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          parent_id?: string;
          status?: "pending" | "accepted" | "rejected";
          created_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          student_id: string;
          google_course_id: string;
          name: string;
          section: string | null;
          description_heading: string | null;
          room: string | null;
          teacher_name: string | null;
          enrollment_code: string | null;
          course_state: string | null;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          google_course_id: string;
          name: string;
          section?: string | null;
          description_heading?: string | null;
          room?: string | null;
          teacher_name?: string | null;
          enrollment_code?: string | null;
          course_state?: string | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          google_course_id?: string;
          name?: string;
          section?: string | null;
          description_heading?: string | null;
          room?: string | null;
          teacher_name?: string | null;
          enrollment_code?: string | null;
          course_state?: string | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assignments: {
        Row: {
          id: string;
          course_id: string;
          google_assignment_id: string;
          title: string;
          description: string | null;
          due_date: string | null;
          due_time: string | null;
          max_points: number | null;
          assignment_type: string | null;
          work_type: string;
          materials: Json | null;
          state: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          course_id: string;
          google_assignment_id: string;
          title: string;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          max_points?: number | null;
          assignment_type?: string | null;
          work_type?: string;
          materials?: Json | null;
          state?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          google_assignment_id?: string;
          title?: string;
          description?: string | null;
          due_date?: string | null;
          due_time?: string | null;
          max_points?: number | null;
          assignment_type?: string | null;
          work_type?: string;
          materials?: Json | null;
          state?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      submissions: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          state: string | null;
          assigned_grade: number | null;
          draft_grade: number | null;
          late: boolean;
          submission_history: Json | null;
          last_synced_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          state?: string | null;
          assigned_grade?: number | null;
          draft_grade?: number | null;
          late?: boolean;
          submission_history?: Json | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          student_id?: string;
          state?: string | null;
          assigned_grade?: number | null;
          draft_grade?: number | null;
          late?: boolean;
          submission_history?: Json | null;
          last_synced_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      assignment_recommendations: {
        Row: {
          id: string;
          assignment_id: string;
          student_id: string;
          recommended_start_date: string;
          complexity_score: number | null;
          estimated_hours: number | null;
          reasoning: string | null;
          priority_rank: number | null;
          calculated_at: string;
        };
        Insert: {
          id?: string;
          assignment_id: string;
          student_id: string;
          recommended_start_date: string;
          complexity_score?: number | null;
          estimated_hours?: number | null;
          reasoning?: string | null;
          priority_rank?: number | null;
          calculated_at?: string;
        };
        Update: {
          id?: string;
          assignment_id?: string;
          student_id?: string;
          recommended_start_date?: string;
          complexity_score?: number | null;
          estimated_hours?: number | null;
          reasoning?: string | null;
          priority_rank?: number | null;
          calculated_at?: string;
        };
      };
      report_cards: {
        Row: {
          id: string;
          student_id: string;
          school_year: string;
          term: string;
          report_date: string | null;
          pdf_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          school_year: string;
          term: string;
          report_date?: string | null;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          school_year?: string;
          term?: string;
          report_date?: string | null;
          pdf_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      report_card_grades: {
        Row: {
          id: string;
          report_card_id: string;
          subject_name: string;
          letter_grade: string | null;
          percentage: number | null;
          teacher_name: string | null;
          teacher_comments: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_card_id: string;
          subject_name: string;
          letter_grade?: string | null;
          percentage?: number | null;
          teacher_name?: string | null;
          teacher_comments?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_card_id?: string;
          subject_name?: string;
          letter_grade?: string | null;
          percentage?: number | null;
          teacher_name?: string | null;
          teacher_comments?: string | null;
          created_at?: string;
        };
      };
      subject_weaknesses: {
        Row: {
          id: string;
          student_id: string;
          subject_name: string;
          weakness_level: "low" | "medium" | "high" | null;
          avg_grade: number | null;
          recent_trend: "improving" | "stable" | "declining" | null;
          evidence: Json | null;
          recommendations: string[] | null;
          calculated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          subject_name: string;
          weakness_level?: "low" | "medium" | "high" | null;
          avg_grade?: number | null;
          recent_trend?: "improving" | "stable" | "declining" | null;
          evidence?: Json | null;
          recommendations?: string[] | null;
          calculated_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          subject_name?: string;
          weakness_level?: "low" | "medium" | "high" | null;
          avg_grade?: number | null;
          recent_trend?: "improving" | "stable" | "declining" | null;
          evidence?: Json | null;
          recommendations?: string[] | null;
          calculated_at?: string;
        };
      };
      progress_snapshots: {
        Row: {
          id: string;
          student_id: string;
          snapshot_date: string;
          total_assignments: number | null;
          completed_assignments: number | null;
          completion_rate: number | null;
          avg_grade: number | null;
          overdue_count: number | null;
          upcoming_count: number | null;
          by_subject: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          snapshot_date: string;
          total_assignments?: number | null;
          completed_assignments?: number | null;
          completion_rate?: number | null;
          avg_grade?: number | null;
          overdue_count?: number | null;
          upcoming_count?: number | null;
          by_subject?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_id?: string;
          snapshot_date?: string;
          total_assignments?: number | null;
          completed_assignments?: number | null;
          completion_rate?: number | null;
          avg_grade?: number | null;
          overdue_count?: number | null;
          upcoming_count?: number | null;
          by_subject?: Json | null;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
