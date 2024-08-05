import generateSampleData from "@controllers/sampleData/sampleData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const force = searchParams.get("force") === "true";
  await generateSampleData({ force });

  return NextResponse.json("Sample data generated");
}
