import Link from "next/link";
import {
  Clock,
  TrendingUp,
  Users,
  Sparkles,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Target,
  Shield,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-secondary-100">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-secondary-900">
              BrightPath
            </span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2.5 text-secondary-600 hover:text-secondary-900 font-medium transition-colors"
            >
              Log in
            </Link>
            <Link href="/signup" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-primary-50/50 via-white to-white overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              <span>Smart Academic Support for Students</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-secondary-900 mb-6 leading-tight">
              Know What to Work On.
              <br />
              <span className="gradient-text">Start Early. Stay Ahead.</span>
            </h1>

            <p className="text-xl text-secondary-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              BrightPath connects to Google Classroom and transforms your
              assignments into actionable guidance. No more last-minute
              cramming.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup" className="btn-primary inline-flex items-center gap-2">
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#features" className="btn-secondary inline-flex items-center gap-2">
                See How It Works
              </Link>
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center justify-center gap-8 text-secondary-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-500" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-500" />
                <span>Google Classroom sync</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary-500" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="mt-16 relative">
            <div className="card-elevated p-2 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-xl p-6 aspect-video flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
                  {/* Mock Smart Start Card */}
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-red-500 text-sm font-medium mb-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                      Start Today
                    </div>
                    <p className="font-semibold text-secondary-900">Math Chapter 5 Assignment</p>
                    <p className="text-sm text-secondary-500 mt-1">Due in 2 days</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2 text-amber-500 text-sm font-medium mb-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full" />
                      Start Soon
                    </div>
                    <p className="font-semibold text-secondary-900">Essay: Climate Change</p>
                    <p className="text-sm text-secondary-500 mt-1">Due in 5 days</p>
                  </div>
                  <div className="col-span-2 bg-gradient-to-r from-primary-500 to-emerald-500 rounded-xl p-4 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-primary-100 text-sm">This Week&apos;s Progress</p>
                        <p className="text-2xl font-bold mt-1">78% Complete</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary-100 text-sm">Streak</p>
                        <p className="text-2xl font-bold mt-1">5 days</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white rounded-xl shadow-xl p-3 animate-float">
              <Clock className="w-6 h-6 text-primary-500" />
            </div>
            <div className="absolute -right-4 top-1/3 bg-white rounded-xl shadow-xl p-3 animate-float" style={{ animationDelay: "1s" }}>
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              BrightPath gives you the tools to stay organized, focused, and ahead of your deadlines.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-primary-50 to-emerald-50 border border-primary-100 hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-500/25 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                Smart Start
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Know exactly when to start each assignment based on complexity,
                due date, and your workload. Never be caught off guard.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/25 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                Progress Tracking
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Visual tracking by subject. See improvement trends, spot
                patterns, and celebrate your wins along the way.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-2xl bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-100 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300">
              <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-violet-500/25 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                Parent Dashboard
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                Parents get clarity without micromanaging. See workload health,
                risk alerts, and improvement signals at a glance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 bg-gradient-to-b from-secondary-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              How BrightPath Works
            </h2>
            <p className="text-xl text-secondary-600">
              Get started in minutes, see results immediately.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <BookOpen className="w-8 h-8 text-primary-600" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                  1
                </span>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">
                Connect Google Classroom
              </h3>
              <p className="text-secondary-600">
                One-click sync brings in all your courses, assignments, and due dates automatically.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <Target className="w-8 h-8 text-emerald-600" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                  2
                </span>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">
                Get Smart Recommendations
              </h3>
              <p className="text-secondary-600">
                Our algorithm tells you what to start and when, based on complexity and your schedule.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <TrendingUp className="w-8 h-8 text-violet-600" />
                <span className="absolute -top-2 -right-2 w-8 h-8 bg-violet-500 rounded-full text-white font-bold flex items-center justify-center text-sm">
                  3
                </span>
              </div>
              <h3 className="text-lg font-bold text-secondary-900 mb-2">
                Stay Ahead, Stress Less
              </h3>
              <p className="text-secondary-600">
                Track your progress, build good habits, and never miss another deadline.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="card-elevated p-12 text-center">
            <Shield className="w-16 h-16 text-primary-500 mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
              Guidance, Not Surveillance
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto leading-relaxed">
              BrightPath is designed to help students succeed, not to track their every move.
              We believe in empowering students with the tools they need while giving parents
              just enough visibility to offer support when needed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-primary-600 via-primary-500 to-emerald-500 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-60 h-60 border-2 border-white rounded-full translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Ahead?
          </h2>
          <p className="text-xl text-primary-100 mb-10">
            Connect your Google Classroom account and see your first recommendations in minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-600 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-200"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-secondary-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-emerald-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">BrightPath</span>
            </div>
            <p className="text-secondary-400">
              Built for students who want to succeed.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
