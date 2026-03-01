import { createClient } from "@/lib/supabase/server";
import type { ChildSummary } from "@/types/parent";
import type {
  ProgressSnapshot,
  SubjectWeakness,
  StudentParentLink,
  Course,
  Assignment,
  Submission,
  Profile,
} from "@/types";
import { calculateWorkloadHealth } from "./calculateWorkloadHealth";
import { identifyInterventions } from "./identifyInterventions";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export async function fetchChildrenSummaries(parentId: string): Promise<ChildSummary[]> {
  const supabase = await createClient();

  // Get linked children (status = 'accepted')
  const { data: links, error: linksError } = await supabase
    .from("student_parent_links")
    .select("student_id")
    .eq("parent_id", parentId)
    .eq("status", "accepted");

  if (linksError || !links || links.length === 0) {
    return [];
  }

  const typedLinks = links as Pick<StudentParentLink, "student_id">[];
  const studentIds = typedLinks.map((link) => link.student_id);

  // Fetch data for all children in parallel
  const summaries = await Promise.all(
    studentIds.map((studentId) => fetchSingleChildSummary(supabase, studentId))
  );

  return summaries.filter((s): s is ChildSummary => s !== null);
}

async function fetchSingleChildSummary(
  supabase: SupabaseClient,
  studentId: string
): Promise<ChildSummary | null> {
  // Fetch profile first (required)
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url")
    .eq("id", studentId)
    .single();

  if (profileError || !profileData) {
    return null;
  }

  const profile = profileData as Pick<Profile, "id" | "full_name" | "avatar_url">;

  // Fetch remaining data in parallel
  const [snapshotResult, weaknessesResult, overdueResult] = await Promise.all([
    supabase
      .from("progress_snapshots")
      .select("*")
      .eq("student_id", studentId)
      .order("snapshot_date", { ascending: false })
      .limit(2),
    supabase.from("subject_weaknesses").select("*").eq("student_id", studentId),
    fetchOverdueAssignments(supabase, studentId),
  ]);

  const snapshots = (snapshotResult.data || []) as ProgressSnapshot[];
  const latestSnapshot = snapshots[0] || null;
  const previousSnapshot = snapshots[1] || null;
  const weaknesses = (weaknessesResult.data || []) as SubjectWeakness[];
  const overdueAssignments = overdueResult;

  // Calculate stats
  const stats = {
    assignmentsDue: latestSnapshot?.upcoming_count ?? 0,
    overdueCount: latestSnapshot?.overdue_count ?? overdueAssignments.length,
    completionRate: latestSnapshot?.completion_rate ?? 100,
  };

  // Calculate workload health
  const { health, reason } = calculateWorkloadHealth({
    overdueCount: stats.overdueCount,
    assignmentsDueThisWeek: stats.assignmentsDue,
    completionRate: stats.completionRate,
  });

  // Prepare subject grades for intervention analysis
  const subjectGrades = weaknesses.map((w) => ({
    subjectName: w.subject_name,
    avgGrade: w.avg_grade ?? 0,
    trend: w.recent_trend,
  }));

  // Identify interventions
  const { interventions, attentionItems } = identifyInterventions({
    overdueAssignments,
    subjectGrades,
    completionRate: stats.completionRate,
    previousCompletionRate: previousSnapshot?.completion_rate ?? null,
  });

  // Get improving and declining subjects
  const improvingSubjects = weaknesses
    .filter((w) => w.recent_trend === "improving")
    .map((w) => w.subject_name);
  const decliningSubjects = weaknesses
    .filter((w) => w.recent_trend === "declining")
    .map((w) => w.subject_name);

  return {
    id: profile.id,
    name: profile.full_name,
    avatarUrl: profile.avatar_url,
    workloadHealth: health,
    healthReason: reason,
    stats,
    improvingSubjects,
    decliningSubjects,
    interventions,
    attentionItems,
  };
}

interface OverdueAssignmentResult {
  title: string;
  daysOverdue: number;
  courseName: string;
}

async function fetchOverdueAssignments(
  supabase: SupabaseClient,
  studentId: string
): Promise<OverdueAssignmentResult[]> {
  const today = new Date().toISOString().split("T")[0];

  // Get courses for this student
  const { data: coursesData } = await supabase
    .from("courses")
    .select("id, name")
    .eq("student_id", studentId);

  const courses = (coursesData || []) as Pick<Course, "id" | "name">[];

  if (courses.length === 0) {
    return [];
  }

  const courseIds = courses.map((c) => c.id);
  const courseMap = new Map(courses.map((c) => [c.id, c.name]));

  // Get assignments past due for these courses
  const { data: assignmentsData } = await supabase
    .from("assignments")
    .select("id, title, due_date, course_id")
    .in("course_id", courseIds)
    .lt("due_date", today)
    .not("due_date", "is", null);

  const assignments = (assignmentsData || []) as Pick<
    Assignment,
    "id" | "title" | "due_date" | "course_id"
  >[];

  if (assignments.length === 0) {
    return [];
  }

  // Get submissions for these assignments by this student
  const assignmentIds = assignments.map((a) => a.id);
  const { data: submissionsData } = await supabase
    .from("submissions")
    .select("assignment_id, state")
    .eq("student_id", studentId)
    .in("assignment_id", assignmentIds);

  const submissions = (submissionsData || []) as Pick<Submission, "assignment_id" | "state">[];
  const submissionMap = new Map(submissions.map((s) => [s.assignment_id, s.state]));

  const overdueAssignments: OverdueAssignmentResult[] = [];

  for (const assignment of assignments) {
    const submissionState = submissionMap.get(assignment.id);

    // If no submission or not turned in/graded, it's overdue
    if (!submissionState || !["TURNED_IN", "RETURNED"].includes(submissionState)) {
      const dueDate = new Date(assignment.due_date!);
      const daysOverdue = Math.floor(
        (new Date().getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      overdueAssignments.push({
        title: assignment.title,
        daysOverdue,
        courseName: courseMap.get(assignment.course_id) || "Unknown Course",
      });
    }
  }

  return overdueAssignments;
}
