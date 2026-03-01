"use client";

import { Header } from "@/components/layout/Header";
import { BookOpen } from "lucide-react";

export default function AssignmentsPage() {
  return (
    <div className="page-transition">
      <Header title="Assignments" subtitle="View and manage all your assignments" />
      <div className="p-8">
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Assignments Coming Soon
          </h2>
          <p className="text-secondary-500 max-w-md mx-auto">
            Sync with Google Classroom to see all your assignments here.
            Use the Sync button to import your coursework.
          </p>
        </div>
      </div>
    </div>
  );
}
