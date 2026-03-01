"use client";

import { Header } from "@/components/layout/Header";
import { TrendingUp } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="page-transition">
      <Header title="Progress" subtitle="Track your academic progress over time" />
      <div className="p-8">
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Progress Tracking Coming Soon
          </h2>
          <p className="text-secondary-500 max-w-md mx-auto">
            Once you have assignments and grades synced, you&apos;ll see your
            progress trends and insights here.
          </p>
        </div>
      </div>
    </div>
  );
}
