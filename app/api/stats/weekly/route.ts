import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET weekly stats for a track
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get("trackId");
    const weekStart = searchParams.get("weekStart");
    const weekEnd = searchParams.get("weekEnd");

    if (!weekStart || !weekEnd) {
      return NextResponse.json(
        { error: "weekStart and weekEnd are required" },
        { status: 400 }
      );
    }

    const where: any = {
      userId: user.userId,
    };

    if (trackId) {
      where.trackId = trackId;
    }

    // Get topics for the week (scheduled or studied in this week)
    const weekStartDate = new Date(weekStart);
    const weekEndDate = new Date(weekEnd);

    const weekTopics = await prisma.topic.findMany({
      where: {
        ...where,
        OR: [
          {
            scheduledDate: {
              gte: weekStartDate,
              lte: weekEndDate,
            },
          },
          {
            lastStudiedAt: {
              gte: weekStartDate,
              lte: weekEndDate,
            },
          },
        ],
      },
    });

    const completed = weekTopics.filter((t) => t.completed);
    const total = weekTopics.length;
    const remaining = total - completed.length;
    const timeMinutes = completed.reduce((sum, t) => sum + t.targetMinutes, 0);

    return NextResponse.json({
      total,
      completed: completed.length,
      remaining,
      timeMinutes,
    });
  } catch (error) {
    console.error("Failed to fetch weekly stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch weekly stats" },
      { status: 500 }
    );
  }
}
