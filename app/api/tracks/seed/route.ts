import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const DEFAULT_TRACKS = [
  {
    name: "JavaScript Fundamentals",
    topics: [
      { title: "Hello, world!", targetMinutes: 15 },
      { title: "Code structure", targetMinutes: 15 },
      { title: 'The modern mode, "use strict"', targetMinutes: 15 },
      { title: "Variables", targetMinutes: 15 },
      { title: "Data types", targetMinutes: 15 },
      { title: "Interaction: alert, prompt, confirm", targetMinutes: 15 },
      { title: "Type Conversions", targetMinutes: 15 },
      { title: "Basic operators, maths", targetMinutes: 15 },
      { title: "Comparisons", targetMinutes: 15 },
      { title: "Conditional branching: if, '?'", targetMinutes: 15 },
      { title: "Logical operators", targetMinutes: 15 },
      { title: "Nullish coalescing operator '??'", targetMinutes: 15 },
      { title: "Loops: while and for", targetMinutes: 15 },
    ],
  },
  {
    name: "MCP Learning",
    topics: [
      { title: "Introduction to MCP", targetMinutes: 20 },
      { title: "MCP Architecture Overview", targetMinutes: 30 },
      { title: "Building Your First MCP Server", targetMinutes: 45 },
      { title: "MCP Client Integration", targetMinutes: 30 },
    ],
  },
  {
    name: "CSS MDN Guides",
    topics: [
      { title: "CSS Basics", targetMinutes: 20 },
      { title: "CSS Selectors", targetMinutes: 25 },
      { title: "The Box Model", targetMinutes: 30 },
      { title: "Flexbox Layout", targetMinutes: 35 },
      { title: "Grid Layout", targetMinutes: 35 },
      { title: "CSS Positioning", targetMinutes: 25 },
      { title: "Responsive Design", targetMinutes: 30 },
      { title: "CSS Variables", targetMinutes: 20 },
    ],
  },
];

// POST seed default tracks
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      `[SEED API] Seeding tracks for user: ${user.username} (${user.userId})`
    );

    // Check if user already has tracks
    const existingTracks = await prisma.track.count({
      where: {
        userId: user.userId,
      },
    });

    if (existingTracks > 0) {
      console.log(
        `[SEED API] User ${user.username} already has ${existingTracks} tracks, skipping seed`
      );
      return NextResponse.json(
        { message: "User already has tracks" },
        { status: 200 }
      );
    }

    console.log(
      `[SEED API] User ${user.username} has no tracks, seeding defaults...`
    );

    // Seed default tracks
    const createdTracks = [];

    for (let i = 0; i < DEFAULT_TRACKS.length; i++) {
      const trackData = DEFAULT_TRACKS[i];
      const track = await prisma.track.create({
        data: {
          name: trackData.name,
          userId: user.userId,
          order: i,
        },
      });

      // Create topics for this track
      const topicsData = trackData.topics.map((topic) => ({
        title: topic.title,
        targetMinutes: topic.targetMinutes,
        userId: user.userId,
        trackId: track.id,
      }));

      await prisma.topic.createMany({
        data: topicsData,
      });

      console.log(
        `[SEED API] Created track "${track.name}" with ${topicsData.length} topics for user ${user.username}`
      );
      createdTracks.push(track);
    }

    console.log(
      `[SEED API] Completed seeding ${createdTracks.length} tracks for user ${user.username}`
    );

    return NextResponse.json(
      {
        message: "Default tracks seeded successfully",
        tracks: createdTracks,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to seed tracks:", error);
    return NextResponse.json(
      { error: "Failed to seed tracks" },
      { status: 500 }
    );
  }
}
