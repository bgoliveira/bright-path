export type { Database, Json } from "./database";

// Convenience types derived from database
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Course = Database["public"]["Tables"]["courses"]["Row"];
export type Assignment = Database["public"]["Tables"]["assignments"]["Row"];
export type Submission = Database["public"]["Tables"]["submissions"]["Row"];
export type AssignmentRecommendation =
  Database["public"]["Tables"]["assignment_recommendations"]["Row"];
export type ReportCard = Database["public"]["Tables"]["report_cards"]["Row"];
export type ReportCardGrade =
  Database["public"]["Tables"]["report_card_grades"]["Row"];
export type SubjectWeakness =
  Database["public"]["Tables"]["subject_weaknesses"]["Row"];
export type ProgressSnapshot =
  Database["public"]["Tables"]["progress_snapshots"]["Row"];
export type StudentParentLink =
  Database["public"]["Tables"]["student_parent_links"]["Row"];

// Import for type reference
import type { Database } from "./database";

// User role type
export type UserRole = "student" | "parent";

// Assignment with recommendation
export interface AssignmentWithRecommendation extends Assignment {
  course?: Course;
  submission?: Submission;
  recommendation?: AssignmentRecommendation;
}

// Smart Start priority levels
export type StartPriority = "start-now" | "start-soon" | "on-track" | "behind";

// Progress trend
export type Trend = "improving" | "stable" | "declining";

// Weakness level
export type WeaknessLevel = "low" | "medium" | "high";
