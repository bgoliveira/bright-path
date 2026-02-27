"use client";

import { Calendar, Clock, AlertTriangle, CheckCircle, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface UpcomingDeadline {
  id: string;
  title: string;
  courseName: string;
  dueDate: Date;
  status: "not-started" | "in-progress" | "submitted";
}

interface UpcomingDeadlinesProps {
  deadlines: UpcomingDeadline[];
}

const statusConfig = {
  "not-started": {
    label: "Not Started",
    color: "text-secondary-500",
    bg: "bg-secondary-100",
    icon: Circle,
  },
  "in-progress": {
    label: "In Progress",
    color: "text-amber-600",
    bg: "bg-amber-100",
    icon: Clock,
  },
  submitted: {
    label: "Submitted",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    icon: CheckCircle,
  },
};

function formatDueDate(date: Date): { text: string; urgent: boolean; color: string } {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return { text: "Overdue", urgent: true, color: "text-red-600" };
  if (days === 0) return { text: "Due Today", urgent: true, color: "text-red-600" };
  if (days === 1) return { text: "Due Tomorrow", urgent: true, color: "text-amber-600" };
  if (days <= 3) return { text: `In ${days} days`, urgent: true, color: "text-amber-600" };

  return {
    text: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    urgent: false,
    color: "text-secondary-600",
  };
}

export function UpcomingDeadlines({ deadlines }: UpcomingDeadlinesProps) {
  const sortedDeadlines = [...deadlines].sort(
    (a, b) => a.dueDate.getTime() - b.dueDate.getTime()
  );

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
          <Calendar className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-secondary-900">
            Upcoming Deadlines
          </h2>
          <p className="text-sm text-secondary-500">What&apos;s coming up next</p>
        </div>
      </div>

      {sortedDeadlines.length === 0 ? (
        <div className="text-center py-8 bg-secondary-50 rounded-xl">
          <Calendar className="w-10 h-10 text-secondary-300 mx-auto mb-3" />
          <p className="text-secondary-500 font-medium">No upcoming deadlines</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedDeadlines.slice(0, 5).map((deadline, index) => {
            const status = statusConfig[deadline.status];
            const dueInfo = formatDueDate(deadline.dueDate);
            const StatusIcon = status.icon;

            return (
              <div
                key={deadline.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md cursor-pointer group",
                  dueInfo.urgent && deadline.status !== "submitted"
                    ? "bg-gradient-to-r from-red-50/50 to-transparent border-red-100"
                    : "bg-white border-secondary-100 hover:border-secondary-200"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Status indicator */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  status.bg
                )}>
                  <StatusIcon className={cn("w-5 h-5", status.color)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-secondary-900 truncate group-hover:text-secondary-700 transition-colors">
                    {deadline.title}
                  </h3>
                  <p className="text-sm text-secondary-500 truncate">
                    {deadline.courseName}
                  </p>
                </div>

                {/* Due date */}
                <div className="text-right flex-shrink-0">
                  <div className={cn(
                    "flex items-center gap-1.5 text-sm font-semibold",
                    dueInfo.color
                  )}>
                    {dueInfo.urgent && deadline.status !== "submitted" && (
                      <AlertTriangle className="w-4 h-4" />
                    )}
                    {dueInfo.text}
                  </div>
                  <span className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                    status.bg,
                    status.color
                  )}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Demo data
export const demoDeadlines: UpcomingDeadline[] = [
  {
    id: "1",
    title: "Math Chapter 5",
    courseName: "Mathematics 10",
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "in-progress",
  },
  {
    id: "2",
    title: "Climate Essay",
    courseName: "English 10",
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    status: "not-started",
  },
  {
    id: "3",
    title: "Lab Report",
    courseName: "Science 10",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "not-started",
  },
  {
    id: "4",
    title: "History Quiz",
    courseName: "Social Studies 10",
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    status: "submitted",
  },
];
