import { AboutUser, Assigned, GameCode } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { NextRequest, NextResponse } from "next/server";
import { Selfie } from "@/database";
import { createUserAssignment } from "@/app/api/controllers/createUserAssignment";

interface GameRouteParams {
  code: string;
}

function fetchLatestAssigned(gameCodeId: number, userId: string) {
  return Assigned.findOne({
    where: {
      userId: userId,
      gameCodeId: gameCodeId,
      completedAt: null,
    },
    include: [
      {
        association: "assignedUser",
        include: ["avatar", "aboutUser"],
      },
    ],
    order: [["assignedAt", "DESC"]],
  });
}

export async function GET(
  request: NextRequest, // needs request function argument due to format of the GET function
  { params }: { params: GameRouteParams },
) {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id!;
  const code = params.code;

  // get query param assignedId from request
  const url = new URL(request.url);
  const assignedIdString = url.searchParams.get("assignedId");
  const assignedId = Number(assignedIdString);
  const gameCode = await GameCode.findOne({
    where: {
      code: code.toLowerCase().trim(),
    },
    include: ["users"],
  });
  let gameState: "waiting" | "started" | "ended" | "notInGame";

  if (!gameCode) {
    return NextResponse.json("Game code not found", { status: 404 });
  }

  if (gameCode.endedAt) {
    gameState = "ended";
    // TODO: Send game stats
    return NextResponse.json({ gameState });
  }

  if (assignedId) {
    // fetch assigned record from the database
    const assignedRecord = await Assigned.findByPk(assignedId, {
      attributes: ["completedAt"],
    });
    // check if the record exists and is not complete
    if (assignedRecord && !assignedRecord.completedAt) {
      return NextResponse.json("VALID");
    }
  }

  const userInGame = gameCode.users.find((user) => user.id === userId);

  if (!userInGame) {
    gameState = "notInGame";
    return NextResponse.json({ gameState });
  }

  if (gameCode.startedAt) {
    gameState = "started";
    let assigned = await fetchLatestAssigned(gameCode.id, userId);
    if (!assigned) {
      const isAssigned = !!(await createUserAssignment(gameCode, userId));
      if (!isAssigned) return NextResponse.json("COMPLETED");
      assigned = await fetchLatestAssigned(gameCode.id, userId);
    }
    return NextResponse.json({ gameState, assigned });
  } else {
    gameState = "waiting";
    return NextResponse.json({ gameState });
  }
}

async function validateSelfie(selfie: File | null) {
  if (!selfie || !selfie.type.startsWith("image/")) {
    throw new Error("File is not an image");
  }
}

async function validateAssigned(assignedId: string, userId: string) {
  const assigned = await Assigned.findByPk(Number(assignedId), {
    include: ["assignedUser"],
  });

  if (!assigned) {
    throw new Error("Invalid assignedId");
  }

  if (assigned.userId !== userId) {
    throw new Error("FORBIDDEN");
  }

  return assigned;
}

async function validateAssignedUserName(
  postedUserName: string,
  assigned: Assigned,
) {
  const aboutUser = await AboutUser.findOne({
    where: { userId: assigned.assignedUserId },
  });
  if (
    postedUserName.toLowerCase().trim() !== aboutUser?.name.toLowerCase().trim()
  ) {
    throw new Error("INVALID_NAME");
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: GameRouteParams },
) {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id!;
  const code = params.code;
  const formData = await request.formData();

  const postedUserName = formData.get("name") as string;
  const selfie = formData.get("selfie") as File;
  const assignedId = formData.get("assignedId") as string;

  try {
    const gameCode = await GameCode.findOne({
      where: { code: code.toLowerCase().trim() },
    });
    if (!gameCode) {
      return NextResponse.json("Game code not found", { status: 404 });
    }
    await validateSelfie(selfie);
    const assigned = await validateAssigned(assignedId, userId);
    await validateAssignedUserName(postedUserName, assigned);

    const selfieBuffer = Buffer.from(await selfie.arrayBuffer());
    const mimeType = selfie.type;

    await assigned.update({ completedAt: new Date() });
    await Selfie.create({
      data: selfieBuffer,
      mimeType: mimeType,
      assignedId: Number(assignedId),
    });

    // Removed new assignment creation from this function
    // as it will be managed by the get function.
    return NextResponse.json({ code: "SUCCESS" }, { status: 201 });
  } catch (error) {
    if (!(error instanceof Error)) {
      return NextResponse.json({ code: "Unknown error" }, { status: 500 });
    }
    let status = 400;
    let code = error.message;

    switch (code) {
      case "File is not an image":
        status = 400;
        break;
      case "Invalid assignedId":
        status = 404;
        break;
      case "FORBIDDEN":
        status = 403;
        break;
      case "INVALID_NAME":
        status = 400;
        break;
      default:
        console.error(error);
        status = 500;
        break;
    }

    return NextResponse.json({ code }, { status });
  }
}
