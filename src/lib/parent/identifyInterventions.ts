import type { InterventionItem, AttentionItem } from "@/types/parent";

interface OverdueAssignment {
  title: string;
  daysOverdue: number;
  courseName: string;
}

interface SubjectGrade {
  subjectName: string;
  avgGrade: number;
  trend: "improving" | "stable" | "declining" | null;
}

interface InterventionInput {
  overdueAssignments: OverdueAssignment[];
  subjectGrades: SubjectGrade[];
  completionRate: number;
  previousCompletionRate: number | null;
}

interface InterventionResult {
  interventions: InterventionItem[];
  attentionItems: AttentionItem[];
}

export function identifyInterventions(input: InterventionInput): InterventionResult {
  const interventions: InterventionItem[] = [];
  const attentionItems: AttentionItem[] = [];

  // Critical: Assignments overdue 3+ days
  const criticalOverdue = input.overdueAssignments.filter((a) => a.daysOverdue >= 3);
  if (criticalOverdue.length > 0) {
    interventions.push({
      type: "overdue",
      severity: "critical",
      message: `${criticalOverdue.length} assignment${criticalOverdue.length > 1 ? "s" : ""} overdue 3+ days`,
      details: criticalOverdue.map((a) => `${a.title} (${a.courseName}) - ${a.daysOverdue} days overdue`),
    });
  }

  // Critical: Failing grades (<50%) in any subject
  const failingSubjects = input.subjectGrades.filter((s) => s.avgGrade !== null && s.avgGrade < 50);
  if (failingSubjects.length > 0) {
    interventions.push({
      type: "failing",
      severity: "critical",
      message: `Failing grades in ${failingSubjects.length} subject${failingSubjects.length > 1 ? "s" : ""}`,
      details: failingSubjects.map((s) => `${s.subjectName}: ${Math.round(s.avgGrade)}%`),
    });
  }

  // Critical: Completion rate dropped >20%
  if (
    input.previousCompletionRate !== null &&
    input.completionRate < input.previousCompletionRate - 20
  ) {
    interventions.push({
      type: "dropped",
      severity: "critical",
      message: `Completion rate dropped from ${Math.round(input.previousCompletionRate)}% to ${Math.round(input.completionRate)}%`,
    });
  }

  // Attention: 1-2 overdue assignments (not critical)
  const minorOverdue = input.overdueAssignments.filter((a) => a.daysOverdue < 3);
  if (minorOverdue.length > 0 && criticalOverdue.length === 0) {
    attentionItems.push({
      type: "overdue",
      message: `${minorOverdue.length} assignment${minorOverdue.length > 1 ? "s" : ""} slightly overdue`,
    });
  }

  // Attention: Grades 50-60%
  const lowGradeSubjects = input.subjectGrades.filter(
    (s) => s.avgGrade !== null && s.avgGrade >= 50 && s.avgGrade < 60
  );
  if (lowGradeSubjects.length > 0) {
    attentionItems.push({
      type: "declining",
      message: `Low grades in: ${lowGradeSubjects.map((s) => s.subjectName).join(", ")}`,
    });
  }

  // Attention: Declining trends
  const decliningSubjects = input.subjectGrades.filter((s) => s.trend === "declining");
  if (decliningSubjects.length > 0) {
    attentionItems.push({
      type: "declining",
      message: `Declining trends in: ${decliningSubjects.map((s) => s.subjectName).join(", ")}`,
    });
  }

  return { interventions, attentionItems };
}
