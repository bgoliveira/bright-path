"use client";

import { TrendingUp, TrendingDown, Clock, CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ChildSummary } from "@/types/parent";
import { WorkloadHealthBadge } from "./WorkloadHealthBadge";
import { InterventionAlert } from "./InterventionAlert";

interface ChildSummaryCardProps {
  child: ChildSummary;
}

export function ChildSummaryCard({ child }: ChildSummaryCardProps) {
  return (
    <Link
      href={`/parent/child/${child.id}`}
      className="block bg-white rounded-xl border border-secondary-200 hover:border-primary-300 hover:shadow-md transition-all"
    >
      <div className="p-6">
        {/* Header: Name and Health Badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
              {child.avatarUrl ? (
                <img
                  src={child.avatarUrl}
                  alt={child.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-xl font-semibold text-primary-600">
                  {child.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900">{child.name}</h3>
              <p className="text-sm text-secondary-500">Student</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-secondary-400 flex-shrink-0" />
        </div>

        {/* Health Badge */}
        <div className="mb-4">
          <WorkloadHealthBadge health={child.workloadHealth} reason={child.healthReason} />
        </div>

        {/* Critical Interventions */}
        {child.interventions.length > 0 && (
          <div className="mb-4">
            <InterventionAlert interventions={child.interventions} />
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-3 bg-secondary-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary-900">{child.stats.assignmentsDue}</p>
            <p className="text-xs text-secondary-500">Due Soon</p>
          </div>
          <div className="text-center p-3 bg-secondary-50 rounded-lg">
            <p className="text-2xl font-bold text-secondary-900">{child.stats.overdueCount}</p>
            <p className="text-xs text-secondary-500">Overdue</p>
          </div>
          <div className="text-center p-3 bg-secondary-50 rounded-lg">
            <p
              className={`text-2xl font-bold ${
                child.stats.completionRate >= 80
                  ? "text-green-600"
                  : child.stats.completionRate >= 60
                    ? "text-amber-600"
                    : "text-red-600"
              }`}
            >
              {Math.round(child.stats.completionRate)}%
            </p>
            <p className="text-xs text-secondary-500">Completion</p>
          </div>
        </div>

        {/* Improving and Declining Subjects */}
        <div className="space-y-3">
          {/* Improving Subjects */}
          {child.improvingSubjects.length > 0 && (
            <div className="flex items-start gap-2">
              <TrendingUp className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-green-700">Improving</p>
                <p className="text-sm text-secondary-600">
                  {child.improvingSubjects.join(", ")}
                </p>
              </div>
            </div>
          )}

          {/* Declining Subjects */}
          {child.decliningSubjects.length > 0 && (
            <div className="flex items-start gap-2">
              <TrendingDown className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-amber-700">Needs Attention</p>
                <p className="text-sm text-secondary-600">
                  {child.decliningSubjects.join(", ")}
                </p>
              </div>
            </div>
          )}

          {/* Attention Items */}
          {child.attentionItems.length > 0 && (
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-amber-700">To Watch</p>
                <ul className="text-sm text-secondary-600">
                  {child.attentionItems.slice(0, 2).map((item, idx) => (
                    <li key={idx}>{item.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* All Good */}
          {child.improvingSubjects.length === 0 &&
            child.decliningSubjects.length === 0 &&
            child.attentionItems.length === 0 &&
            child.interventions.length === 0 && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">All subjects on track</span>
              </div>
            )}
        </div>
      </div>
    </Link>
  );
}
