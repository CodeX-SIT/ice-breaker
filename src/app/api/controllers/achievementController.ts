import { Achievement, UserAchievement, Assigned, User } from "@/database";
import { Op } from "sequelize";
import achievementsData from "@/achievements.json"

interface AchievementCheck {
  userId: string;
  gameCodeId: number;
  assignedId?: number;
}

export async function checkAndAwardAchievements({
  userId,
  gameCodeId,
  assignedId,
}: AchievementCheck) {
  const newAchievements: string[] = [];

  // Get user's completed assignments in this game
  const userAssignments = await Assigned.findAll({
    where: {
      userId,
      gameCodeId,
      completedAt: { [Op.not]: null },
    },
    order: [["completedAt", "ASC"]],
  });

  // Check FirstMatch
  if (userAssignments.length === 1) {
    const awarded = await awardAchievement(userId, "FirstMatch", gameCodeId);
    if (awarded) newAchievements.push("FirstMatch");
  }

  // Check FastFriend (3 matches in under 1 minute)
  if (userAssignments.length >= 3) {
    const recentMatches = userAssignments.slice(-3);
    const firstCompletedAt = recentMatches[0].completedAt;
    const lastCompletedAt = recentMatches[2].completedAt;

    if (firstCompletedAt && lastCompletedAt) {
      const timeSpan =
        new Date(lastCompletedAt).getTime() -
        new Date(firstCompletedAt).getTime();
      if (timeSpan <= 60000) {
        const awarded = await awardAchievement(
          userId,
          "FastFriend",
          gameCodeId,
          { timeSpan, matches: 3 },
        );
        if (awarded) newAchievements.push("FastFriend");
      }
    }
  }

  // Check SocialButterfly (5+ matches in one game)
  if (userAssignments.length >= 5) {
    const awarded = await awardAchievement(
      userId,
      "SocialButterfly",
      gameCodeId,
      { totalMatches: userAssignments.length },
    );
    if (awarded) newAchievements.push("SocialButterfly");
  }

  // Check SpeedDemon (assignment completed in under 30 seconds)
  if (assignedId) {
    const currentAssignment = userAssignments.find((a) => a.id === assignedId);
    if (
      currentAssignment &&
      currentAssignment.completedAt &&
      currentAssignment.assignedAt
    ) {
      const assignmentDuration =
        new Date(currentAssignment.completedAt).getTime() -
        new Date(currentAssignment.assignedAt).getTime();
      if (assignmentDuration <= 30000) {
        const awarded = await awardAchievement(
          userId,
          "SpeedDemon",
          gameCodeId,
          { duration: assignmentDuration },
        );
        if (awarded) newAchievements.push("SpeedDemon");
      }
    }
  }

  return newAchievements;
}

async function awardAchievement(
  userId: string,
  achievementName: string,
  gameCodeId?: number,
  metadata?: any,
) {
  try {
    // Check if user already has this achievement in this game
    const existingAward = await UserAchievement.findOne({
      include: [
        {
          model: Achievement,
          as: "achievement",
          where: { name: achievementName },
        },
      ],
      where: {
        userId,
        gameCodeId,
      },
    });

    if (existingAward) return false;

    // Find achievement data from JSON
    const achievementData = achievementsData.achievements.find(
      (a: any) => a.name === achievementName,
    );
    if (!achievementData) {
      console.warn(`Achievement '${achievementName}' not found in JSON`);
      return false;
    }

    // Find or create achievement in database
    const [achievement] = await Achievement.findOrCreate({
      where: { name: achievementName },
      defaults: {
        name: achievementName,
        description: achievementData.description,
        icon: achievementData.icon,
        criteria: achievementData.criteria || {},
      },
    });

    await UserAchievement.create({
      userId,
      achievementId: achievement.id,
      gameCodeId,
      metadata,
    });

    return true;
  } catch (error) {
    console.error(`Error awarding achievement '${achievementName}':`, error);
    return false;
  }
}

export async function getUserAchievements(userId: string, gameCodeId?: number) {
  const whereClause: any = { userId };
  if (gameCodeId) {
    whereClause.gameCodeId = gameCodeId;
  }

  return UserAchievement.findAll({
    where: whereClause,
    include: [
      {
        model: Achievement,
        as: "achievement",
      },
    ],
    order: [["awardedAt", "DESC"]],
  });
}

export async function getGameAchievements(gameCodeId: number) {
  return UserAchievement.findAll({
    where: { gameCodeId },
    include: [
      {
        model: Achievement,
        as: "achievement",
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["awardedAt", "DESC"]],
  });
}

export function getAchievementById(name: string) {
  return achievementsData.achievements.find(
    (achievement: any) => achievement.name === name,
  );
}

export function getAllAchievements() {
  return achievementsData.achievements;
}
