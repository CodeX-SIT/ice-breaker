import { Assigned, User } from "@/database";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await Assigned.findAll({
    include: ["user", "assignedUser"],
  });
  return NextResponse.json(result);
}

/**
 * @description This function just keeps a record for queries for reference.
 */
async function sampleQueries() {
  // List of all current assignments (useful for admins)
  Assigned.findAll({
    include: ["User", "AssignedUser"],
  });

  // List of users with their hobbies
  User.findAll({
    include: ["hobbies"],
  });

  // List of users that the person is supposed to find.
  User.findAll({
    include: ["assignedUsers"],
  });

  // List of users who are supposed to find that person
  User.findAll({
    include: ["assignedToUsers"],
  });
}
