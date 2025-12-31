import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfWeek, endOfWeek } from "date-fns";

// GET weekly statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");
    const referenceDate = dateParam ? new Date(dateParam) : new Date();

    const weekStart = startOfWeek(referenceDate, { weekStartsOn: 0 }); // Sunday
    const weekEnd = endOfWeek(referenceDate, { weekStartsOn: 0 }); // Saturday

    const todos = await prisma.todo.findMany({
      where: {
        date: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    type TodoItem = (typeof todos)[number];

    const completed = todos.filter((todo: TodoItem) => todo.completed).length;
    const notCompleted = todos.filter(
      (todo: TodoItem) => !todo.completed
    ).length;
    const totalDuration = todos
      .filter((todo: TodoItem) => todo.completed)
      .reduce((sum: number, todo: TodoItem) => sum + todo.duration, 0);

    return NextResponse.json({
      weekStart,
      weekEnd,
      total: todos.length,
      completed,
      notCompleted,
      totalDuration,
      todos,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch weekly stats" },
      { status: 500 }
    );
  }
}
