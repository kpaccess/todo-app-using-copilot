import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all todos or filter by date range
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let where = {};
    if (startDate && endDate) {
      where = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate),
        },
      };
    }

    const todos = await prisma.todo.findMany({
      where,
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(todos);
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    return NextResponse.json(
      { error: "Failed to fetch todos" },
      { status: 500 }
    );
  }
}

// POST create new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, date, duration } = body;

    if (!task || !date || !duration) {
      return NextResponse.json(
        { error: "Task, date, and duration are required" },
        { status: 400 }
      );
    }

    const todo = await prisma.todo.create({
      data: {
        task,
        date: new Date(date),
        duration: parseInt(duration),
      },
    });

    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    console.error("Failed to create todo:", error);
    return NextResponse.json(
      { error: "Failed to create todo" },
      { status: 500 }
    );
  }
}
