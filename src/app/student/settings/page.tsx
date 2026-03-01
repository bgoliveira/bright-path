"use client";

import { Header } from "@/components/layout/Header";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="page-transition">
      <Header title="Settings" subtitle="Manage your account and preferences" />
      <div className="p-8">
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-secondary-600" />
          </div>
          <h2 className="text-xl font-semibold text-secondary-900 mb-2">
            Settings Coming Soon
          </h2>
          <p className="text-secondary-500 max-w-md mx-auto">
            Manage your profile, notification preferences, and connected
            accounts here.
          </p>
        </div>
      </div>
    </div>
  );
}
