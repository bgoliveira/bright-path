"use client";

import { Header } from "@/components/layout/Header";
import {
  SmartStartWidget,
  demoSmartStartItems,
} from "@/components/student/SmartStartWidget";
import {
  ProgressOverview,
  demoSubjectProgress,
} from "@/components/student/ProgressOverview";
import {
  UpcomingDeadlines,
  demoDeadlines,
} from "@/components/student/UpcomingDeadlines";
import { EncouragementBanner } from "@/components/student/EncouragementBanner";
import { BookOpen, Calendar, Flame, CheckCircle2 } from "lucide-react";

export default function StudentDashboard() {
  const handleSync = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Syncing with Google Classroom...");
  };

  return (
    <div className="page-transition">
      <Header
        title="Dashboard"
        subtitle="Welcome back! Here's what needs your attention."
        showSync
        onSync={handleSync}
      />

      <div className="p-8">
        {/* Encouragement Banner */}
        <div className="mb-8">
          <EncouragementBanner
            completedThisWeek={3}
            streak={5}
            improvingSubjects={["Mathematics", "Science"]}
          />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card p-5 group hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 font-medium">Active Courses</p>
                <p className="text-2xl font-bold text-secondary-900">6</p>
              </div>
            </div>
          </div>

          <div className="card p-5 group hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 font-medium">Due This Week</p>
                <p className="text-2xl font-bold text-secondary-900">4</p>
              </div>
            </div>
          </div>

          <div className="card p-5 group hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 font-medium">Completed</p>
                <p className="text-2xl font-bold text-secondary-900">12</p>
              </div>
            </div>
          </div>

          <div className="card p-5 group hover:shadow-lg transition-all duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-secondary-500 font-medium">Streak</p>
                <p className="text-2xl font-bold text-secondary-900">5 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            <SmartStartWidget items={demoSmartStartItems} />
            <UpcomingDeadlines deadlines={demoDeadlines} />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ProgressOverview
              subjects={demoSubjectProgress}
              overallCompletion={78}
            />

            {/* Sync Status */}
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900">Google Classroom</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <p className="text-sm text-emerald-600 font-medium">Connected</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-secondary-400 uppercase tracking-wide font-medium">Last synced</p>
                  <p className="text-sm text-secondary-700 font-medium mt-1">
                    Just now
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
