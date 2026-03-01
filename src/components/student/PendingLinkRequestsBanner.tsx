"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, ArrowRight, X } from "lucide-react";

interface LinkRequest {
  id: string;
  status: "pending" | "accepted" | "rejected";
  parent: {
    full_name: string;
  } | null;
}

export function PendingLinkRequestsBanner() {
  const [pendingRequests, setPendingRequests] = useState<LinkRequest[]>([]);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await fetch("/api/student/link-requests");
        if (response.ok) {
          const data = await response.json();
          const pending = (data.links || []).filter(
            (link: LinkRequest) => link.status === "pending"
          );
          setPendingRequests(pending);
        }
      } catch (err) {
        console.error("Failed to fetch pending requests:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  if (isLoading || pendingRequests.length === 0 || isDismissed) {
    return null;
  }

  const count = pendingRequests.length;
  const parentNames = pendingRequests
    .slice(0, 2)
    .map((r) => r.parent?.full_name || "A parent")
    .join(", ");

  return (
    <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-4 shadow-lg shadow-violet-500/25 relative overflow-hidden">
      <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-semibold text-white">
              {count === 1
                ? `${parentNames} wants to connect with you`
                : `${count} parents want to connect with you`}
            </p>
            <p className="text-violet-100 text-sm">
              Review and respond to parent link requests
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/student/link-requests"
            className="flex items-center gap-2 px-4 py-2 bg-white text-violet-600 font-medium rounded-lg hover:bg-violet-50 transition-colors"
          >
            Review
            <ArrowRight className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
