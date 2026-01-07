import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET topic notes
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

    // Verify topic belongs to user
    const topic = await prisma.topic.findFirst({
      where: {
        id,
        userId: user.userId,
      },
      include: {
        note: true,
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    return NextResponse.json(topic.note || {});
  } catch (error) {
    console.error("Failed to fetch notes:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// PUT upsert topic notes
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { keyIdea, example, recallQuestion } = await request.json();

    // Verify topic belongs to user
    const topic = await prisma.topic.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    const note = await prisma.topicNote.upsert({
      where: {
        topicId: id,
      },
      update: {
        keyIdea: keyIdea || null,
        example: example || null,
        recallQuestion: recallQuestion || null,
      },
      create: {
        topicId: id,
        keyIdea: keyIdea || null,
        example: example || null,
        recallQuestion: recallQuestion || null,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error("Failed to save notes:", error);
    return NextResponse.json(
      { error: "Failed to save notes" },
      { status: 500 }
    );
  }
}
