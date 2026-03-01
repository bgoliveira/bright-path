"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Handle magic link tokens from URL hash
    const handleMagicLink = async () => {
      const hash = window.location.hash;
      if (!hash || !hash.includes("access_token")) return;

      setIsLoading(true);

      // Parse hash parameters
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        const supabase = createClient();

        // Set the session
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Session error:", error);
          setIsLoading(false);
          return;
        }

        if (data.user) {
          // Get user role from profile
          const { data: profileData } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .single();

          const profile = profileData as { role: string } | null;
          const role = profile?.role || "student";
          router.push(`/${role}/dashboard`);
        }
      }
    };

    handleMagicLink();
  }, [router]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    // Redirect to Google OAuth flow
    window.location.href = "/api/auth/google";
  };

  return (
    <main className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-700 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-secondary-900">
              BrightPath
            </span>
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Welcome back
          </h1>
          <p className="text-secondary-500 mb-8">
            Sign in to continue tracking your progress
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white border-2 border-secondary-200 rounded-xl hover:bg-secondary-50 hover:border-secondary-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-secondary-300 border-t-primary-500 rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            )}
            <span className="font-semibold text-secondary-700 group-hover:text-secondary-900 transition-colors">
              {isLoading ? "Signing in..." : "Continue with Google"}
            </span>
          </button>

          <p className="text-sm text-secondary-400 text-center mt-6">
            We use Google to connect with Google Classroom
          </p>

          {/* Sign up link */}
          <p className="text-center mt-8 text-secondary-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decoration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-500 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white text-center">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-8 backdrop-blur">
            <Sparkles className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Stay Ahead of Your Studies
          </h2>
          <p className="text-primary-100 text-lg max-w-md">
            BrightPath helps you know what to work on and when to start.
            Never miss a deadline again.
          </p>
        </div>
      </div>
    </main>
  );
}
