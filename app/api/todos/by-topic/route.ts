import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

// GET /api/todos/by-topic?title=JavaScript%20Basics
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title");
    if (!title) {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const sessions = await prisma.todo.findMany({
      where: { userId: user.userId, task: title },
      orderBy: { date: "asc" },
      select: { id: true, task: true, date: true, duration: true, completed: true },
    });

    // Aggregate minutes per yyyy-mm-dd
    const byDay: Record<string, { totalMinutes: number; count: number }> = {};
    for (const s of sessions) {
      const d = new Date(s.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      if (!byDay[key]) byDay[key] = { totalMinutes: 0, count: 0 };
      byDay[key].totalMinutes += s.duration || 0;
      byDay[key].count += 1;
    }

    const days = Object.entries(byDay)
      .map(([day, v]) => ({ day, totalMinutes: v.totalMinutes, count: v.count }))
      .sort((a, b) => (a.day < b.day ? -1 : 1));

    return NextResponse.json({ title, sessions, days });
  } catch (error) {
    console.error("Failed to fetch sessions by topic:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
