export type WorkloadHealth = "healthy" | "moderate" | "stressed";

export interface ChildSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
  workloadHealth: WorkloadHealth;
  healthReason: string;
  stats: {
    assignmentsDue: number;
    overdueCount: number;
    completionRate: number;
  };
  improvingSubjects: string[];
  decliningSubjects: string[];
  interventions: InterventionItem[];
  attentionItems: AttentionItem[];
}

export interface InterventionItem {
  type: "overdue" | "failing" | "dropped";
  severity: "critical";
  message: string;
  details?: string[];
}

export interface AttentionItem {
  type: "overdue" | "declining" | "workload";
  message: string;
}
