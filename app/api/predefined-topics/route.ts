import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const topics = await prisma.predefinedTopic.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Failed to fetch predefined topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch predefined topics" },
      { status: 500 }
    );
  }
}
