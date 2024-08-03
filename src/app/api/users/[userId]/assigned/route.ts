import { Assigned } from "@/database";
import { NextRequest, NextResponse } from "next/server";

type AssignedRouteParams = {
  params: {
    userId: string;
  };
};

/**
 * This will return the latest assigned user for the given user and their avatar.
 */
export async function GET(
  request: NextRequest, // needs request function argument due to format of the GET function
  { params }: AssignedRouteParams,
) {
  const result = await Assigned.findAll({
    where: {
      userId: params.userId,
      isCompleted: false,
    },
    include: [
      {
        as: "assignedUser",
        include: ["avatar"],
      },
    ],
    limit: 1,
    order: [["assignedAt", "DESC"]],
  });
  return new NextResponse(JSON.stringify(result, null, 2));
}
