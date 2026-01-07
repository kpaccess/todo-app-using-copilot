import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET single topic
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const topic = await prisma.topic.findFirst({
      where: {
        id,
        userId: user.userId,
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

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Failed to fetch topic:", error);
    return NextResponse.json(
      { error: "Failed to fetch topic" },
      { status: 500 }
    );
  }
}

// PATCH update topic
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const {
      title,
      targetMinutes,
      scheduledDate,
      sourceUrl,
      completed,
      lastStudiedAt,
    } = await request.json();

    // Verify topic belongs to user
    const existingTopic = await prisma.topic.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!existingTopic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json(
          { error: "Invalid topic title" },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    if (targetMinutes !== undefined) {
      updateData.targetMinutes = targetMinutes;
    }

    if (scheduledDate !== undefined) {
      updateData.scheduledDate = scheduledDate ? new Date(scheduledDate) : null;
    }

    if (sourceUrl !== undefined) {
      updateData.sourceUrl = sourceUrl || null;
    }

    if (completed !== undefined) {
      updateData.completed = completed;
      // When marking as completed, update lastStudiedAt
      if (completed) {
        updateData.lastStudiedAt = new Date();
      }
    }

    if (lastStudiedAt !== undefined) {
      updateData.lastStudiedAt = lastStudiedAt ? new Date(lastStudiedAt) : null;
    }

    const topic = await prisma.topic.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        note: true,
        track: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(topic);
  } catch (error) {
    console.error("Failed to update topic:", error);
    return NextResponse.json(
      { error: "Failed to update topic" },
      { status: 500 }
    );
  }
}

// DELETE topic
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Verify topic belongs to user
    const existingTopic = await prisma.topic.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!existingTopic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    await prisma.topic.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete topic:", error);
    return NextResponse.json(
      { error: "Failed to delete topic" },
      { status: 500 }
    );
  }
}
