"use client";

import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubjectProgress {
  name: string;
  completionRate: number;
  trend: "improving" | "stable" | "declining";
  color: string;
}

interface ProgressOverviewProps {
  subjects: SubjectProgress[];
  overallCompletion: number;
}

const trendConfig = {
  improving: {
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    label: "Improving",
  },
  stable: {
    icon: Minus,
    color: "text-secondary-500",
    bg: "bg-secondary-50",
    label: "Stable",
  },
  declining: {
    icon: TrendingDown,
    color: "text-red-500",
    bg: "bg-red-50",
    label: "Needs attention",
  },
};

export function ProgressOverview({
  subjects,
  overallCompletion,
}: ProgressOverviewProps) {
  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
          <BarChart3 className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-secondary-900">
            Progress Overview
          </h2>
          <p className="text-sm text-secondary-500">Your completion by subject</p>
        </div>
      </div>

      {/* Overall completion */}
      <div className="mb-6 p-4 bg-gradient-to-br from-secondary-50 to-secondary-100/50 rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-secondary-600">Overall Completion</span>
          <span className="text-2xl font-bold text-secondary-900">
            {overallCompletion}%
          </span>
        </div>
        <div className="h-3 bg-white rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${overallCompletion}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20" />
          </div>
        </div>
      </div>

      {/* By subject */}
      <div className="space-y-4">
        {subjects.map((subject) => {
          const trend = trendConfig[subject.trend];
          const TrendIcon = trend.icon;

          return (
            <div key={subject.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="text-sm font-semibold text-secondary-700">
                    {subject.name}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                    trend.bg,
                    trend.color
                  )}>
                    <TrendIcon className="w-3 h-3" />
                    {trend.label}
                  </div>
                  <span className="text-sm font-bold text-secondary-900 w-10 text-right">
                    {subject.completionRate}%
                  </span>
                </div>
              </div>
              <div className="h-2 bg-secondary-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                  style={{
                    width: `${subject.completionRate}%`,
                    backgroundColor: subject.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Demo data
export const demoSubjectProgress: SubjectProgress[] = [
  { name: "Mathematics", completionRate: 85, trend: "improving", color: "#3B82F6" },
  { name: "English", completionRate: 72, trend: "stable", color: "#10B981" },
  { name: "Science", completionRate: 90, trend: "improving", color: "#8B5CF6" },
  { name: "Social Studies", completionRate: 65, trend: "declining", color: "#F59E0B" },
];
