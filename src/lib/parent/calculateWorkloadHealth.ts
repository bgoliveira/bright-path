import type { WorkloadHealth } from "@/types/parent";

interface WorkloadMetrics {
  overdueCount: number;
  assignmentsDueThisWeek: number;
  completionRate: number;
}

interface WorkloadResult {
  health: WorkloadHealth;
  reason: string;
}

export function calculateWorkloadHealth(metrics: WorkloadMetrics): WorkloadResult {
  const { overdueCount, assignmentsDueThisWeek, completionRate } = metrics;

  // Stressed conditions: 4+ overdue OR 9+ due this week OR <60% completion
  if (overdueCount >= 4) {
    return {
      health: "stressed",
      reason: `${overdueCount} overdue assignments need attention`,
    };
  }
  if (assignmentsDueThisWeek >= 9) {
    return {
      health: "stressed",
      reason: `Heavy week with ${assignmentsDueThisWeek} assignments due`,
    };
  }
  if (completionRate < 60) {
    return {
      health: "stressed",
      reason: `Completion rate at ${completionRate}% needs improvement`,
    };
  }

  // Moderate conditions: 2-3 overdue OR 5-8 due this week OR 60-80% completion
  if (overdueCount >= 2) {
    return {
      health: "moderate",
      reason: `${overdueCount} overdue assignments to catch up on`,
    };
  }
  if (assignmentsDueThisWeek >= 5) {
    return {
      health: "moderate",
      reason: `Busy week with ${assignmentsDueThisWeek} assignments due`,
    };
  }
  if (completionRate < 80) {
    return {
      health: "moderate",
      reason: `Completion rate at ${completionRate}%`,
    };
  }

  // Healthy
  return {
    health: "healthy",
    reason: "On track with assignments",
  };
}
