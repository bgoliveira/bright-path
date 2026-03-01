"use client";

import { Header } from "@/components/layout/Header";
import { Users } from "lucide-react";

export default function ChildrenPage() {
  return (
    <div className="page-transition">
      <Header title="Children" subtitle="Manage linked student accounts" />
      <div className="p-8">
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-100 to-violet-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-violet-600" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Link Your Children&apos;s Accounts
          </h2>
          <p className="text-secondary-500 max-w-md mx-auto">
            Connect with your children&apos;s BrightPath accounts to monitor
            their academic progress and upcoming assignments.
          </p>
        </div>
      </div>
    </div>
  );
}
