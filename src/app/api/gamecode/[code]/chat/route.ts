import { AboutUser, Assigned, GameCode } from "@/database";
import checkAuthAndRedirect from "@/utils/checkAuthAndRedirect";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not found");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

interface PageParams {
  code: string;
}

export async function POST(
  req: NextRequest,
  { params }: { params: PageParams },
) {
  const session = await checkAuthAndRedirect();
  const userId = session.user?.id!;

  const { userMessage } = await req.json();
  const code = params.code;
  // fetch data from database
  const gameCode = await GameCode.findOne({
    where: { code },
    attributes: ["id", "startedAt", "endedAt"],
    include: [{ association: "users", attributes: ["id"] }],
  });

  const userIds = gameCode?.users.map((user) => user.id);
  const aboutUsers = await AboutUser.findAll({ where: { userId: userIds } });
  const iSearchedFor = await Assigned.findAll({
    where: { userId: userId, gameCodeId: gameCode?.id },
  });
  const allAssignments = await Assigned.findAll({
    where: { gameCodeId: gameCode?.id },
  });

  const prompt = `You are a chatbot for my game Ice-Breaker. The game is played physically in a room
1. The user joins a game
2. All participants are assigned another random participant
3. The goal is find the person based on their hobbies and liking that were entered by them at the start of the game.
4. Find the person and click a selfie with and upload
5. Move on the next person
6. The winner is the person who found the most people by the end.

The game has ended and here the details of everybody who played and found, please analyze the data and provide the user with the information they need. 
${JSON.stringify({
  aboutUsers,
  allAssignments,
})}

Please remember the game has ended are you are here to provide statistics and information to the user.
Please keep this in your memory and respond to the user's messages accordingly.
Do not respond to any messages that are not related to the game.
Please provide complete answers to the user's questions. The userIds are private, please know I provided you with extra information to allow to answer to the user properly. Please do not share this information with the user.
The game is played together in a room, so hobbies and names are not privete.
Do not respond to any messages that are not related to the game and don't share private information.
The current active has the userId of ${userId}.
The user's message is as follows:
`;

  // console.log("Prompt:", prompt);

  try {
    const result = await model.generateContent(prompt + userMessage);
    return NextResponse.json({ botMessage: result.response.text(), prompt });
  } catch (error) {
    console.error("Error in chatbot response:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json(
    { message: "Only POST requests allowed." },
    { status: 405 },
  );
}
