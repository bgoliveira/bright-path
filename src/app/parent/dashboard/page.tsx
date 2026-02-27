"use client";

import { Header } from "@/components/layout/Header";
import { AlertTriangle, TrendingUp, CheckCircle, Users } from "lucide-react";

// Demo child data
const demoChildren = [
  {
    id: "1",
    name: "Alex",
    avatar: null,
    workloadHealth: "healthy" as const,
    assignmentsDue: 3,
    completionRate: 85,
    improvingSubjects: ["Math", "Science"],
    needsAttention: [],
  },
];

type WorkloadHealth = "healthy" | "moderate" | "stressed";

const healthConfig: Record<
  WorkloadHealth,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  healthy: {
    label: "Looking Good",
    color: "text-green-600",
    bg: "bg-green-50",
    icon: <CheckCircle className="w-5 h-5" />,
  },
  moderate: {
    label: "Moderate Load",
    color: "text-amber-600",
    bg: "bg-amber-50",
    icon: <AlertTriangle className="w-5 h-5" />,
  },
  stressed: {
    label: "Heavy Week",
    color: "text-red-600",
    bg: "bg-red-50",
    icon: <AlertTriangle className="w-5 h-5" />,
  },
};

export default function ParentDashboard() {
  const child = demoChildren[0]; // For now, show first child
  const health = healthConfig[child.workloadHealth];

  return (
    <div>
      <Header
        title="Parent Dashboard"
        subtitle="Overview of your child's academic progress"
      />

      <div className="p-8">
        {/* Child Selector (for future multi-child support) */}
        <div className="mb-6">
          <div className="flex items-center gap-3 bg-white rounded-xl border border-secondary-200 p-4">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-secondary-900">{child.name}</p>
              <p className="text-sm text-secondary-500">Student</p>
            </div>
          </div>
        </div>

        {/* Workload Health Card */}
        <div
          className={`rounded-xl p-6 mb-6 ${health.bg} border border-${health.color.replace("text-", "")}/20`}
        >
          <div className="flex items-center gap-3">
            <div className={health.color}>{health.icon}</div>
            <div>
              <h2 className={`font-semibold ${health.color}`}>
                {health.label}
              </h2>
              <p className="text-sm text-secondary-600 mt-1">
                {child.assignmentsDue} assignments due this week •{" "}
                {child.completionRate}% completion rate
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Improvement Signals */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-secondary-900">
                Improvement Signals
              </h3>
            </div>
            {child.improvingSubjects.length > 0 ? (
              <div className="space-y-3">
                {child.improvingSubjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-secondary-700">{subject}</span>
                    <span className="text-sm text-green-600 ml-auto">
                      Improving
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-secondary-500">
                No significant changes this week
              </p>
            )}
          </div>

          {/* Areas Needing Attention */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-secondary-900">
                Areas to Watch
              </h3>
            </div>
            {child.needsAttention.length > 0 ? (
              <div className="space-y-3">
                {child.needsAttention.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-amber-500 rounded-full" />
                    <span className="text-secondary-700">{subject}</span>
                    <span className="text-sm text-amber-600 ml-auto">
                      Needs support
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-secondary-500">All subjects on track!</p>
              </div>
            )}
          </div>

          {/* Weekly Overview */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6 lg:col-span-2">
            <h3 className="font-semibold text-secondary-900 mb-4">
              This Week&apos;s Summary
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <p className="text-3xl font-bold text-secondary-900">3</p>
                <p className="text-sm text-secondary-500">Assignments Due</p>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <p className="text-3xl font-bold text-secondary-900">2</p>
                <p className="text-sm text-secondary-500">Completed</p>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">85%</p>
                <p className="text-sm text-secondary-500">Completion Rate</p>
              </div>
              <div className="text-center p-4 bg-secondary-50 rounded-lg">
                <p className="text-3xl font-bold text-primary-600">5</p>
                <p className="text-sm text-secondary-500">Day Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guidance Note */}
        <div className="mt-6 bg-primary-50 border border-primary-100 rounded-xl p-6">
          <p className="text-primary-800">
            <strong>Tip:</strong> {child.name} is maintaining good habits.
            Consider celebrating their consistency this week!
          </p>
        </div>
      </div>
    </div>
  );
}
