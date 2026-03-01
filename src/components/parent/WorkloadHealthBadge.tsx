import { CheckCircle, AlertTriangle } from "lucide-react";
import type { WorkloadHealth } from "@/types/parent";

interface WorkloadHealthBadgeProps {
  health: WorkloadHealth;
  reason: string;
}

const healthConfig: Record<
  WorkloadHealth,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  healthy: {
    label: "Looking Good",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  moderate: {
    label: "Moderate Load",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  stressed: {
    label: "Heavy Week",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
};

export function WorkloadHealthBadge({ health, reason }: WorkloadHealthBadgeProps) {
  const config = healthConfig[health];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
      <span className={config.color}>{config.icon}</span>
      <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
      <span className="text-xs text-secondary-500 hidden sm:inline">- {reason}</span>
    </div>
  );
}
