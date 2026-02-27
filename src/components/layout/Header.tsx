"use client";

import { RefreshCw, Bell, Search } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  showSync?: boolean;
  onSync?: () => Promise<void>;
}

export function Header({ title, subtitle, showSync, onSync }: HeaderProps) {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    if (!onSync) return;
    setIsSyncing(true);
    try {
      await onSync();
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-secondary-100 px-8 py-6 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
          {subtitle && (
            <p className="text-secondary-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search assignments..."
              className="w-64 pl-10 pr-4 py-2 bg-secondary-50 border border-secondary-200 rounded-xl text-sm text-secondary-700 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
            />
          </div>

          {/* Sync Button */}
          {showSync && (
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 disabled:opacity-50 font-medium text-sm"
            >
              <RefreshCw
                className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`}
              />
              <span>{isSyncing ? "Syncing..." : "Sync"}</span>
            </button>
          )}

          {/* Notifications */}
          <button className="relative p-2.5 text-secondary-500 hover:text-secondary-700 hover:bg-secondary-50 rounded-xl transition-all group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full ring-2 ring-white" />
          </button>
        </div>
      </div>
    </header>
  );
}
