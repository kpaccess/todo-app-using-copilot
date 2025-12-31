import { NextRequest } from "next/server";
import { JWTPayload, jwtVerify } from "jose";

export const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const encoder = new TextEncoder();
export const JWT_SECRET_KEY = encoder.encode(JWT_SECRET);

export interface AuthUser {
  userId: string;
  username: string;
}

export async function verifyToken(
  request: NextRequest
): Promise<AuthUser | null> {
  try {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(token, JWT_SECRET_KEY);
    const authPayload = payload as JWTPayload & Partial<AuthUser>;

    if (
      typeof authPayload.userId !== "string" ||
      typeof authPayload.username !== "string"
    ) {
      return null;
    }

    return {
      userId: authPayload.userId,
      username: authPayload.username,
    };
  } catch (error) {
    console.error("Auth verification error:", error);
    return null;
  }
}
