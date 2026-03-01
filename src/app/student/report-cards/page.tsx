"use client";

import { Header } from "@/components/layout/Header";
import { FileText } from "lucide-react";

export default function ReportCardsPage() {
  return (
    <div className="page-transition">
      <Header title="Report Cards" subtitle="View and upload your report cards" />
      <div className="p-8">
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Report Cards Coming Soon
          </h2>
          <p className="text-secondary-500 max-w-md mx-auto">
            Upload your BC Report Cards to track grades and identify areas
            for improvement.
          </p>
        </div>
      </div>
    </div>
  );
}
