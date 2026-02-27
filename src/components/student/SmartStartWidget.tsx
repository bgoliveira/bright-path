"use client";

import { Clock, AlertCircle, CheckCircle, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SmartStartItem {
  id: string;
  title: string;
  courseName: string;
  dueDate: Date;
  recommendedStartDate: Date;
  complexity: number;
  estimatedHours: number;
  priority: "start-now" | "start-soon" | "on-track";
}

interface SmartStartWidgetProps {
  items: SmartStartItem[];
}

const priorityConfig = {
  "start-now": {
    label: "Start Today",
    color: "text-red-600",
    bgColor: "bg-gradient-to-br from-red-50 to-rose-50",
    borderColor: "border-red-100",
    accentColor: "bg-red-500",
    icon: AlertCircle,
  },
  "start-soon": {
    label: "Start Soon",
    color: "text-amber-600",
    bgColor: "bg-gradient-to-br from-amber-50 to-yellow-50",
    borderColor: "border-amber-100",
    accentColor: "bg-amber-500",
    icon: Clock,
  },
  "on-track": {
    label: "On Track",
    color: "text-emerald-600",
    bgColor: "bg-gradient-to-br from-emerald-50 to-green-50",
    borderColor: "border-emerald-100",
    accentColor: "bg-emerald-500",
    icon: CheckCircle,
  },
};

function formatDate(date: Date): string {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  if (days < 7) return `In ${days} days`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function SmartStartWidget({ items }: SmartStartWidgetProps) {
  if (items.length === 0) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-secondary-900">
            What to Start Today
          </h2>
        </div>
        <div className="text-center py-12 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="font-semibold text-emerald-700 mb-1">You&apos;re all caught up!</p>
          <p className="text-emerald-600 text-sm">
            No urgent assignments right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-secondary-900">
              What to Start Today
            </h2>
            <p className="text-sm text-secondary-500">Based on complexity & deadlines</p>
          </div>
        </div>
        <Link
          href="/student/assignments"
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1 font-medium group"
        >
          View all
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-3">
        {items.slice(0, 3).map((item, index) => {
          const config = priorityConfig[item.priority];
          const Icon = config.icon;

          return (
            <div
              key={item.id}
              className={cn(
                "p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer group",
                config.bgColor,
                config.borderColor
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  config.accentColor
                )}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("text-xs font-semibold uppercase tracking-wide", config.color)}>
                      {config.label}
                    </span>
                    {item.priority === "start-now" && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-secondary-900 group-hover:text-secondary-700 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-secondary-500 mt-0.5">
                    {item.courseName}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-secondary-700">
                    Due {formatDate(item.dueDate)}
                  </p>
                  <p className="text-xs text-secondary-400 mt-1">
                    ~{item.estimatedHours}h estimated
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Demo data for when there's no real data
export const demoSmartStartItems: SmartStartItem[] = [
  {
    id: "1",
    title: "Math Chapter 5 Assignment",
    courseName: "Mathematics 10",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    recommendedStartDate: new Date(),
    complexity: 7,
    estimatedHours: 3,
    priority: "start-now",
  },
  {
    id: "2",
    title: "Essay: Climate Change Effects",
    courseName: "English 10",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    recommendedStartDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    complexity: 8,
    estimatedHours: 5,
    priority: "start-soon",
  },
  {
    id: "3",
    title: "Science Lab Report",
    courseName: "Science 10",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    recommendedStartDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    complexity: 5,
    estimatedHours: 2,
    priority: "on-track",
  },
];
