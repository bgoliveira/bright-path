"use client";

import Link from "next/link";
import { useState } from "react";
import { Sparkles, ArrowLeft, BookOpen, Users, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "student" | "parent" | null;

export default function SignupPage() {
  const [role, setRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = async () => {
    if (!role) return;

    setIsLoading(true);
    // Store role in sessionStorage to use after OAuth callback
    sessionStorage.setItem("signupRole", role);
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
            Get started
          </h1>
          <p className="text-secondary-500 mb-8">
            Create your account to start tracking progress
          </p>

          {/* Role Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-secondary-700 mb-4">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={cn(
                  "relative p-6 rounded-2xl border-2 transition-all duration-200 text-left group",
                  role === "student"
                    ? "border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10"
                    : "border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50"
                )}
              >
                {role === "student" && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all",
                  role === "student"
                    ? "bg-primary-500 shadow-lg shadow-primary-500/25"
                    : "bg-secondary-100 group-hover:bg-secondary-200"
                )}>
                  <BookOpen className={cn(
                    "w-6 h-6",
                    role === "student" ? "text-white" : "text-secondary-500"
                  )} />
                </div>
                <div className="font-semibold text-secondary-900 mb-1">Student</div>
                <div className="text-sm text-secondary-500">
                  Track my assignments
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole("parent")}
                className={cn(
                  "relative p-6 rounded-2xl border-2 transition-all duration-200 text-left group",
                  role === "parent"
                    ? "border-violet-500 bg-violet-50 shadow-lg shadow-violet-500/10"
                    : "border-secondary-200 hover:border-secondary-300 hover:bg-secondary-50"
                )}
              >
                {role === "parent" && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-violet-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all",
                  role === "parent"
                    ? "bg-violet-500 shadow-lg shadow-violet-500/25"
                    : "bg-secondary-100 group-hover:bg-secondary-200"
                )}>
                  <Users className={cn(
                    "w-6 h-6",
                    role === "parent" ? "text-white" : "text-secondary-500"
                  )} />
                </div>
                <div className="font-semibold text-secondary-900 mb-1">Parent</div>
                <div className="text-sm text-secondary-500">
                  Help my child succeed
                </div>
              </button>
            </div>
          </div>

          {/* Google Sign Up Button */}
          <button
            onClick={handleGoogleSignup}
            disabled={!role || isLoading}
            className={cn(
              "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-semibold transition-all duration-200",
              role
                ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-xl hover:-translate-y-0.5"
                : "bg-secondary-100 text-secondary-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span>
              {isLoading
                ? "Creating account..."
                : role
                ? "Sign up with Google"
                : "Select your role first"}
            </span>
          </button>

          <p className="text-sm text-secondary-400 text-center mt-6">
            By signing up, you agree to our Terms of Service
          </p>

          {/* Login link */}
          <p className="text-center mt-8 text-secondary-600">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary-600 hover:text-primary-700 font-semibold"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Decoration */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-violet-600 via-purple-500 to-indigo-500 relative overflow-hidden">
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
            Join BrightPath Today
          </h2>
          <p className="text-violet-100 text-lg max-w-md">
            Connect your Google Classroom and get personalized recommendations
            for when to start your assignments.
          </p>

          {/* Features */}
          <div className="mt-12 space-y-4 text-left">
            {[
              "Smart Start recommendations",
              "Progress tracking by subject",
              "Parent visibility (no micromanagement)",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-violet-100">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
