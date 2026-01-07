import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET topics with optional filters
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const trackId = searchParams.get("trackId");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "createdAt";
    const weekStart = searchParams.get("weekStart");
    const weekEnd = searchParams.get("weekEnd");

    const where: any = {
      userId: user.userId,
    };

    if (trackId) {
      where.trackId = trackId;
    }

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (weekStart && weekEnd) {
      where.OR = [
        {
          scheduledDate: {
            gte: new Date(weekStart),
            lte: new Date(weekEnd),
          },
        },
        {
          lastStudiedAt: {
            gte: new Date(weekStart),
            lte: new Date(weekEnd),
          },
        },
      ];
    }

    const orderBy: any = {};
    switch (sort) {
      case "title":
        orderBy.title = "asc";
        break;
      case "completed":
        orderBy.completed = "asc";
        break;
      case "scheduledDate":
        orderBy.scheduledDate = "asc";
        break;
      case "lastStudiedAt":
        orderBy.lastStudiedAt = "desc";
        break;
      default:
        orderBy.createdAt = "desc";
    }

    const topics = await prisma.topic.findMany({
      where,
      orderBy,
      include: {
        note: true,
        track: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(topics);
  } catch (error) {
    console.error("Failed to fetch topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

// POST create new topic
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topicId, title, trackId, targetMinutes = 15, scheduledDate, sourceUrl } = body || {};

    // If a predefined topicId is provided, add it to the todo list
    if (topicId && typeof topicId === "string") {
      const predefinedTopic = await prisma.predefinedTopic.findUnique({ where: { id: topicId } });
      if (!predefinedTopic) {
        return NextResponse.json({ error: "Predefined topic not found" }, { status: 404 });
      }

      const todo = await prisma.todo.create({
        data: {
          task: predefinedTopic.title,
          date: new Date(),
          duration: 0,
          completed: false,
          userId: user.userId,
        },
      });

      return NextResponse.json(todo, { status: 201 });
    }

    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic title is required" },
        { status: 400 }
      );
    }

    if (!trackId || typeof trackId !== "string") {
      return NextResponse.json(
        { error: "Track ID is required" },
        { status: 400 }
      );
    }

    // Verify track belongs to user
    const track = await prisma.track.findFirst({
      where: {
        id: trackId,
        userId: user.userId,
      },
    });

    if (!track) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    const topic = await prisma.topic.create({
      data: {
        title: title.trim(),
        trackId,
        userId: user.userId,
        targetMinutes,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        sourceUrl: sourceUrl || null,
      },
      include: {
        note: true,
        track: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(topic, { status: 201 });
  } catch (error) {
    console.error("Failed to create topic:", error);
    return NextResponse.json(
      { error: "Failed to create topic" },
      { status: 500 }
    );
  }
}

// New endpoint to fetch predefined topics
export async function GETPredefinedTopics() {
  try {
    const topics = await prisma.predefinedTopic.findMany();
    return NextResponse.json(topics);
  } catch (error) {
    console.error("Error fetching predefined topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch predefined topics" },
      { status: 500 }
    );
  }
}

// New endpoint to add predefined topics to the todo list
export async function POSTAddToTodoList(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topicId } = await request.json();

    if (!topicId || typeof topicId !== "string") {
      return NextResponse.json(
        { error: "Topic ID is required" },
        { status: 400 }
      );
    }

    const predefinedTopic = await prisma.predefinedTopic.findUnique({
      where: { id: topicId },
    });

    if (!predefinedTopic) {
      return NextResponse.json(
        { error: "Predefined topic not found" },
        { status: 404 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        task: predefinedTopic.title,
        date: new Date(),
        duration: 0,
        completed: false,
        userId: user.userId,
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Failed to add topic to todo list:", error);
    return NextResponse.json(
      { error: "Failed to add topic to todo list" },
      { status: 500 }
    );
  }
}
