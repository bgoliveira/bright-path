"use client";

import { Sparkles, Trophy, Star, Rocket } from "lucide-react";

interface EncouragementBannerProps {
  completedThisWeek: number;
  streak: number;
  improvingSubjects: string[];
}

const encouragements = [
  { icon: Sparkles, message: "You're doing great! Keep up the momentum!", emoji: "✨" },
  { icon: Trophy, message: "Champion effort this week!", emoji: "🏆" },
  { icon: Star, message: "You're on fire! Amazing work!", emoji: "⭐" },
  { icon: Rocket, message: "Unstoppable! Keep reaching for the stars!", emoji: "🚀" },
];

export function EncouragementBanner({
  completedThisWeek,
  streak,
  improvingSubjects,
}: EncouragementBannerProps) {
  // Select encouragement based on performance
  const encouragementIndex =
    streak > 5 ? 3 : completedThisWeek > 5 ? 1 : streak > 3 ? 2 : 0;
  const { icon: Icon, message, emoji } = encouragements[encouragementIndex];

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-500 rounded-2xl p-6 text-white shadow-xl shadow-primary-500/25">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative flex items-center gap-5">
        <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-xl">{message}</h3>
            <span className="text-2xl">{emoji}</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-primary-100">
            {completedThisWeek > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                {completedThisWeek} assignments completed this week
              </span>
            )}
            {streak > 0 && (
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                {streak} day streak
              </span>
            )}
          </div>
        </div>
      </div>

      {improvingSubjects.length > 0 && (
        <div className="relative mt-4 pt-4 border-t border-white/20">
          <p className="text-sm text-primary-100">
            Great progress in:{" "}
            {improvingSubjects.map((subject, i) => (
              <span key={subject}>
                <span className="font-semibold text-white bg-white/20 px-2 py-0.5 rounded-full text-xs">
                  {subject}
                </span>
                {i < improvingSubjects.length - 1 && <span className="mx-1">&</span>}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
