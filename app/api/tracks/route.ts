import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET all tracks for current user
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      `[TRACKS API] Fetching tracks for user: ${user.username} (${user.userId})`
    );

    const tracks = await prisma.track.findMany({
      where: {
        userId: user.userId,
      },
      include: {
        _count: {
          select: {
            topics: true,
          },
        },
        topics: {
          where: {
            completed: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    // Transform to include progress counts
    const tracksWithProgress = tracks.map((track) => {
      const trackWithCounts = track as typeof track & {
        _count: { topics: number };
        topics: { id: string }[];
      };

      return {
        id: track.id,
        name: track.name,
        order: track.order,
        createdAt: track.createdAt,
        totalTopics: trackWithCounts._count.topics,
        completedTopics: trackWithCounts.topics.length,
      };
    });

    console.log(
      `[TRACKS API] Found ${tracks.length} tracks for user ${user.username}`
    );
    tracksWithProgress.forEach((track) => {
      console.log(`  - Track: ${track.name} (${track.totalTopics} topics)`);
    });

    return NextResponse.json(tracksWithProgress);
  } catch (error) {
    console.error("Failed to fetch tracks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tracks" },
      { status: 500 }
    );
  }
}

// POST create new track
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Track name is required" },
        { status: 400 }
      );
    }

    // Get max order for this user
    const maxOrderTrack = await prisma.track.findFirst({
      where: {
        userId: user.userId,
      },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });

    const newOrder = maxOrderTrack ? maxOrderTrack.order + 1 : 0;

    const track = await prisma.track.create({
      data: {
        name: name.trim(),
        userId: user.userId,
        order: newOrder,
      },
    });

    return NextResponse.json(track, { status: 201 });
  } catch (error) {
    console.error("Failed to create track:", error);
    return NextResponse.json(
      { error: "Failed to create track" },
      { status: 500 }
    );
  }
}
