import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// PATCH update track (rename or reorder)
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
    const { name, order } = await request.json();

    // Verify track belongs to user
    const existingTrack = await prisma.track.findFirst({
      where: {
        id,
        userId: user.userId,
      },
    });

    if (!existingTrack) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
          { error: "Invalid track name" },
          { status: 400 }
        );
      }
      updateData.name = name.trim();
    }

    if (order !== undefined) {
      if (typeof order !== "number" || order < 0) {
        return NextResponse.json(
          { error: "Invalid order value" },
          { status: 400 }
        );
      }
      updateData.order = order;
    }

    const track = await prisma.track.update({
      where: {
        id,
      },
      data: updateData,
    });

    return NextResponse.json(track);
  } catch (error) {
    console.error("Failed to update track:", error);
    return NextResponse.json(
      { error: "Failed to update track" },
      { status: 500 }
    );
  }
}

// DELETE track
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

    // Verify track belongs to user
    const existingTrack = await prisma.track.findFirst({
      where: {
        id,
        userId: user.userId,
      },
      include: {
        _count: {
          select: {
            topics: true,
          },
        },
      },
    });

    if (!existingTrack) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    // Optional: prevent deletion if track has topics
    // Uncomment if you want to enforce this
    // if (existingTrack._count.topics > 0) {
    //   return NextResponse.json(
    //     { error: "Cannot delete track with topics" },
    //     { status: 400 }
    //   );
    // }

    await prisma.track.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete track:", error);
    return NextResponse.json(
      { error: "Failed to delete track" },
      { status: 500 }
    );
  }
}
