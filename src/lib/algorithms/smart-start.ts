import type { Assignment, AssignmentRecommendation } from "@/types";

interface AssignmentInput {
  id: string;
  title: string;
  description?: string | null;
  dueDate: Date | null;
  maxPoints?: number | null;
  courseId: string;
}

interface StudentHistory {
  avgDailyWorkHours: number;
}

export interface SmartStartRecommendation {
  assignmentId: string;
  recommendedStartDate: Date;
  complexityScore: number;
  estimatedHours: number;
  priorityRank: number;
  reasoning: string;
  priority: "start-now" | "start-soon" | "on-track" | "behind";
}

// Keywords that indicate higher complexity assignments
const COMPLEXITY_KEYWORDS = [
  "essay",
  "research",
  "project",
  "presentation",
  "analysis",
  "report",
  "portfolio",
  "paper",
  "thesis",
  "experiment",
  "investigation",
];

// Keywords that indicate simpler assignments
const SIMPLE_KEYWORDS = [
  "quiz",
  "worksheet",
  "practice",
  "review",
  "reading",
  "watch",
  "complete",
];

/**
 * Calculate complexity score for an assignment (1-10)
 */
export function calculateComplexity(assignment: AssignmentInput): number {
  let score = 5; // Base score

  // Points indicate importance/complexity
  if (assignment.maxPoints) {
    if (assignment.maxPoints >= 100) score += 3;
    else if (assignment.maxPoints >= 50) score += 2;
    else if (assignment.maxPoints >= 20) score += 1;
  }

  // Description length can indicate complexity
  if (assignment.description) {
    const wordCount = assignment.description.split(/\s+/).length;
    if (wordCount > 200) score += 2;
    else if (wordCount > 100) score += 1;
  }

  // Check for complexity keywords
  const text = (
    assignment.title +
    " " +
    (assignment.description || "")
  ).toLowerCase();

  const complexKeywordMatches = COMPLEXITY_KEYWORDS.filter((kw) =>
    text.includes(kw)
  ).length;
  score += Math.min(complexKeywordMatches, 2); // Max +2 from keywords

  // Check for simple keywords (reduce complexity)
  const simpleKeywordMatches = SIMPLE_KEYWORDS.filter((kw) =>
    text.includes(kw)
  ).length;
  score -= Math.min(simpleKeywordMatches, 2); // Max -2 from simple keywords

  // Clamp between 1-10
  return Math.min(10, Math.max(1, score));
}

/**
 * Estimate work time in hours based on complexity
 */
export function estimateWorkTime(complexityScore: number): number {
  // Rough formula: complexity score translates to hours
  // Score 1-3: 0.5-1.5 hours
  // Score 4-6: 2-4 hours
  // Score 7-10: 5-10 hours

  if (complexityScore <= 3) {
    return 0.5 + complexityScore * 0.33;
  }
  if (complexityScore <= 6) {
    return 2 + (complexityScore - 3) * 0.67;
  }
  return 5 + (complexityScore - 6) * 1.25;
}

/**
 * Calculate recommended start date for an assignment
 */
export function calculateStartDate(
  assignment: AssignmentInput,
  complexityScore: number,
  estimatedHours: number,
  avgWorkHoursPerDay: number = 2
): { startDate: Date; daysUntilDue: number; workDaysNeeded: number } {
  if (!assignment.dueDate) {
    // No due date - recommend starting soon
    return {
      startDate: new Date(),
      daysUntilDue: 0,
      workDaysNeeded: 1,
    };
  }

  const now = new Date();
  const daysUntilDue = Math.ceil(
    (assignment.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Buffer factor: more complex = need more buffer
  const bufferMultiplier = 1 + complexityScore / 20;
  const workDaysNeeded = Math.ceil(
    (estimatedHours / avgWorkHoursPerDay) * bufferMultiplier
  );

  // Calculate when to start
  // Don't recommend starting more than 2 weeks in advance
  const maxAdvanceDays = Math.min(daysUntilDue - 1, 14);
  const startInDays = Math.max(
    0,
    Math.min(daysUntilDue - workDaysNeeded, maxAdvanceDays)
  );

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + startInDays);

  return {
    startDate,
    daysUntilDue,
    workDaysNeeded,
  };
}

/**
 * Generate reasoning text for the recommendation
 */
export function generateReasoning(
  assignment: AssignmentInput,
  daysUntilDue: number,
  workDaysNeeded: number,
  complexityScore: number
): string {
  const reasons: string[] = [];

  if (daysUntilDue <= 1) {
    reasons.push("Due very soon");
  } else if (daysUntilDue <= 3) {
    reasons.push("Due this week");
  } else if (daysUntilDue <= 7) {
    reasons.push("Due within a week");
  }

  if (workDaysNeeded >= 5) {
    reasons.push("Complex assignment requiring significant time");
  } else if (workDaysNeeded >= 3) {
    reasons.push("Moderate complexity");
  }

  if (assignment.maxPoints && assignment.maxPoints >= 100) {
    reasons.push("High point value");
  }

  if (complexityScore >= 8) {
    reasons.push("Major assignment");
  }

  return reasons.join(". ") || "Regular assignment";
}

/**
 * Determine priority level based on timing
 */
export function determinePriority(
  recommendedStartDate: Date,
  dueDate: Date | null
): SmartStartRecommendation["priority"] {
  const now = new Date();
  const startDiff = Math.ceil(
    (recommendedStartDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  // If due date has passed
  if (dueDate && dueDate < now) {
    return "behind";
  }

  // Should have already started
  if (startDiff < 0) {
    return "behind";
  }

  // Start today
  if (startDiff === 0) {
    return "start-now";
  }

  // Start within 2 days
  if (startDiff <= 2) {
    return "start-soon";
  }

  // On track
  return "on-track";
}

/**
 * Main function: Calculate Smart Start recommendations for all assignments
 */
export async function calculateSmartStart(
  assignments: AssignmentInput[],
  studentHistory?: StudentHistory
): Promise<SmartStartRecommendation[]> {
  const avgWorkHoursPerDay = studentHistory?.avgDailyWorkHours || 2;

  // Filter out assignments without due dates or already past due
  const now = new Date();
  const validAssignments = assignments.filter((a) => {
    if (!a.dueDate) return true; // Include assignments without due dates
    return a.dueDate >= now;
  });

  // Calculate recommendations for each assignment
  const recommendations = validAssignments.map((assignment) => {
    const complexityScore = calculateComplexity(assignment);
    const estimatedHours = estimateWorkTime(complexityScore);
    const { startDate, daysUntilDue, workDaysNeeded } = calculateStartDate(
      assignment,
      complexityScore,
      estimatedHours,
      avgWorkHoursPerDay
    );

    const priority = determinePriority(startDate, assignment.dueDate);
    const reasoning = generateReasoning(
      assignment,
      daysUntilDue,
      workDaysNeeded,
      complexityScore
    );

    return {
      assignmentId: assignment.id,
      recommendedStartDate: startDate,
      complexityScore,
      estimatedHours: Math.round(estimatedHours * 10) / 10,
      priorityRank: 0, // Will be set after sorting
      reasoning,
      priority,
    };
  });

  // Sort by priority and start date
  const priorityOrder = {
    behind: 0,
    "start-now": 1,
    "start-soon": 2,
    "on-track": 3,
  };

  recommendations.sort((a, b) => {
    // First by priority level
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then by start date (sooner first)
    const dateDiff =
      a.recommendedStartDate.getTime() - b.recommendedStartDate.getTime();
    if (dateDiff !== 0) return dateDiff;

    // Finally by complexity (higher complexity = higher priority if dates are same)
    return b.complexityScore - a.complexityScore;
  });

  // Assign priority ranks
  return recommendations.map((rec, index) => ({
    ...rec,
    priorityRank: index + 1,
  }));
}

/**
 * Convert database assignment to input format
 */
export function assignmentToInput(assignment: Assignment): AssignmentInput {
  return {
    id: assignment.id,
    title: assignment.title,
    description: assignment.description,
    dueDate: assignment.due_date ? new Date(assignment.due_date) : null,
    maxPoints: assignment.max_points,
    courseId: assignment.course_id,
  };
}

/**
 * Convert recommendation to database format
 */
export function recommendationToDb(
  rec: SmartStartRecommendation,
  studentId: string
): Omit<AssignmentRecommendation, "id" | "calculated_at"> {
  return {
    assignment_id: rec.assignmentId,
    student_id: studentId,
    recommended_start_date: rec.recommendedStartDate.toISOString().split("T")[0],
    complexity_score: rec.complexityScore,
    estimated_hours: rec.estimatedHours,
    reasoning: rec.reasoning,
    priority_rank: rec.priorityRank,
  };
}
