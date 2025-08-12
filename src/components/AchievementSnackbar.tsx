"use client";

import { useState, useEffect } from "react";

interface AchievementSnackbarProps {
  newAchievements: string[];
  onAchievementShown: (achievementName: string) => void;
}

interface AchievementData {
  name: string;
  description: string;
  icon: string;
}

// Static achievement data (matching achievements.json)
const achievementDetails: Record<string, AchievementData> = {
  FirstMatch: {
    name: "FirstMatch",
    description: "Complete your first assignment",
    icon: "🎯",
  },
  SpeedDemon: {
    name: "SpeedDemon",
    description: "Complete an assignment in under 30 seconds",
    icon: "💨",
  },
  FastFriend: {
    name: "FastFriend",
    description: "Find 3 people in under 1 minute",
    icon: "⚡",
  },
  SocialButterfly: {
    name: "SocialButterfly",
    description: "Find 5 or more people in one game",
    icon: "🦋",
  },
};

export default function AchievementSnackbar({
  newAchievements,
  onAchievementShown,
}: AchievementSnackbarProps) {
  const [currentAchievement, setCurrentAchievement] = useState<string | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(false);
  const [queue, setQueue] = useState<string[]>([]);

  // Get achievement details from static data
  const getAchievementDetails = (
    achievementName: string,
  ): AchievementData | null => {
    return achievementDetails[achievementName] || null;
  };

  useEffect(() => {
    if (newAchievements.length > 0) {
      setQueue((prev) => [...prev, ...newAchievements]);
    }
  }, [newAchievements]);

  useEffect(() => {
    if (queue.length > 0 && !currentAchievement) {
      const next = queue[0];
      setQueue((prev) => prev.slice(1));
      setCurrentAchievement(next);
      setIsVisible(true);

      // Auto-hide after 2.5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => {
          setCurrentAchievement(null);
          onAchievementShown(next);
        }, 300); // Wait for fade-out animation
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [queue, currentAchievement, onAchievementShown]);

  if (!currentAchievement) return null;

  const achievement = getAchievementDetails(currentAchievement);
  if (!achievement) return null;

  return (
    <div
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-lg min-w-[280px] max-w-[90vw] mx-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl animate-bounce">{achievement.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-sm">🏆 Achievement Unlocked!</div>
            <div className="font-semibold text-base">{achievement.name}</div>
            <div className="text-xs opacity-90 mt-1">
              {achievement.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
