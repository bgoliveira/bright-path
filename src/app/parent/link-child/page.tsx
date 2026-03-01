"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { ArrowLeft, Mail, Send, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

interface LinkRequest {
  id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  student: {
    id: string;
    full_name: string;
    email: string;
  } | null;
}

export default function LinkChildPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [linkRequests, setLinkRequests] = useState<LinkRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLinkRequests = async () => {
    try {
      const response = await fetch("/api/parent/link-child");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/parent/link-child", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentEmail: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to send link request");
        return;
      }

      setSuccess("Link request sent successfully! The student will need to accept it.");
      setEmail("");
      fetchLinkRequests();
    } catch (err) {
      console.error("Submit error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
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

  return (
    <div className="page-transition">
      <Header
        title="Link a Child"
        subtitle="Connect with your child's student account"
      />

      <div className="p-8">
        <Link
          href="/parent/dashboard"
          className="inline-flex items-center gap-2 text-secondary-600 hover:text-secondary-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Send Link Request Form */}
          <div className="card p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-secondary-900">
                  Send Link Request
                </h2>
                <p className="text-sm text-secondary-500">
                  Enter your child&apos;s student email address
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-secondary-700 mb-2"
                >
                  Student Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.edu"
                  required
                  className="w-full px-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl text-secondary-700 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                />
              </div>

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Link Request
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 p-4 bg-secondary-50 rounded-xl">
              <p className="text-sm text-secondary-600">
                <strong>How it works:</strong> Once you send a request, your child
                will receive a notification to accept or reject the link. After
                they accept, you&apos;ll be able to view their academic progress.
              </p>
            </div>
          </div>

          {/* Link Requests List */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">
              Your Link Requests
            </h2>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              </div>
            ) : linkRequests.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-6 h-6 text-secondary-400" />
                </div>
                <p className="text-secondary-500">No link requests yet</p>
                <p className="text-sm text-secondary-400 mt-1">
                  Send your first request using the form
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {linkRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 bg-secondary-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-secondary-900">
                        {request.student?.full_name || "Unknown Student"}
                      </p>
                      <p className="text-sm text-secondary-500">
                        {request.student?.email || "No email"}
                      </p>
                      <p className="text-xs text-secondary-400 mt-1">
                        Sent {formatDate(request.created_at)}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
