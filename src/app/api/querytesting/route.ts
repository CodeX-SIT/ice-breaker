import { Assigned, User } from "@/database";
import { NextResponse } from "next/server";

export async function GET() {
  const result = await Assigned.findAll({
    include: ["User", "AssignedUser"],
  });
  return new NextResponse(JSON.stringify(result, null, 2));
}

/**
 * This function just keeps a record for queries for reference.
 */
async function sampleQueries() {
  // List of users with their hobbies
  User.findAll({
    include: ["Hobbies"],
  });

  // List of users that the person is supposed to find.
  User.findAll({
    include: ["AssignedUsers"],
  });

  // List of users who are supposed to find that person
  User.findAll({
    include: ["AssignedToUsers"],
  });
}
