"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import {
  ArrowLeft,
  Users,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import Link from "next/link";

interface LinkRequest {
  id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  parent: {
    id: string;
    full_name: string;
    email: string;
  } | null;
}

export default function StudentLinkRequestsPage() {
  const [linkRequests, setLinkRequests] = useState<LinkRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchLinkRequests = async () => {
    try {
      const response = await fetch("/api/student/link-requests");
      if (response.ok) {
        const data = await response.json();
        setLinkRequests(data.links || []);
      }
    } catch (err) {
      console.error("Failed to fetch link requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinkRequests();
  }, []);

  const handleResponse = async (id: string, status: "accepted" | "rejected") => {
    setProcessingId(id);
    try {
      const response = await fetch(`/api/student/link-requests/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        fetchLinkRequests();
      }
    } catch (err) {
      console.error("Failed to update link request:", err);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-amber-500" />;
      case "accepted":
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-amber-50 text-amber-700 border-amber-200",
      accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${
          styles[status as keyof typeof styles] || ""
        }`}
      >
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const pendingRequests = linkRequests.filter((r) => r.status === "pending");
  const processedRequests = linkRequests.filter((r) => r.status !== "pending");

  return (
    <div className="page-transition">
      <Header
        title="Parent Link Requests"
        subtitle="Manage requests from parents to view your progress"
      />

      <div className="p-8">
        <Link
          href="/student/dashboard"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : linkRequests.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-secondary-400" />
            </div>
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">
              No Link Requests
            </h2>
            <p className="text-secondary-500 max-w-md mx-auto">
              You don&apos;t have any parent link requests. When a parent sends you a
              request, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Pending Requests ({pendingRequests.length})
                </h2>
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="card p-5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-violet-600" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">
                            {request.parent?.full_name || "Unknown Parent"}
                          </p>
                          <p className="text-sm text-secondary-500">
                            {request.parent?.email || "No email"}
                          </p>
                          <p className="text-xs text-secondary-400 mt-1">
                            Requested {formatDate(request.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleResponse(request.id, "rejected")}
                          disabled={processingId === request.id}
                          className="flex items-center gap-2 px-4 py-2 bg-secondary-100 text-secondary-700 font-medium rounded-lg hover:bg-secondary-200 transition-colors disabled:opacity-50"
                        >
                          {processingId === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Decline
                        </button>
                        <button
                          onClick={() => handleResponse(request.id, "accepted")}
                          disabled={processingId === request.id}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50"
                        >
                          {processingId === request.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processed Requests */}
            {processedRequests.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-secondary-900 mb-4">
                  History
                </h2>
                <div className="space-y-3">
                  {processedRequests.map((request) => (
                    <div
                      key={request.id}
                      className="card p-4 flex items-center justify-between bg-secondary-50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-secondary-500" />
                        </div>
                        <div>
                          <p className="font-medium text-secondary-900">
                            {request.parent?.full_name || "Unknown Parent"}
                          </p>
                          <p className="text-sm text-secondary-500">
                            {formatDate(request.created_at)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
