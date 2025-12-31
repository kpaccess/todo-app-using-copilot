import { NextRequest, NextResponse } from "next/server";

// POST logout user
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Logout successful" });

    // Clear the auth cookie
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
