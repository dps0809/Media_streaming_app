import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import { createApiResponse } from "@/types/apiresponse";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    // Verify the user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return createApiResponse(false, "Unauthorized — please sign in first", 401);
    }

    const { password, confirmPassword } = await request.json();

    // ── Validation ──────────────────────────────────────────────
    if (!password || !confirmPassword) {
      return createApiResponse(false, "Password and confirmation are required", 400);
    }

    if (password.length < 6) {
      return createApiResponse(false, "Password must be at least 6 characters", 400);
    }

    if (password !== confirmPassword) {
      return createApiResponse(false, "Passwords do not match", 400);
    }

    await dbConnect();

    const user = await User.findById(session.user.id);
    if (!user) {
      return createApiResponse(false, "User not found", 404);
    }

    // If user already has a password, don't overwrite it from this endpoint
    if (user.password) {
      return createApiResponse(false, "Password is already set. Use the change-password flow instead.", 400);
    }

    // ── Set the password ────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return createApiResponse(true, "Password set successfully", 200);
  } catch (error) {
    console.error("[SET-PASSWORD] Error:", error);
    if (error instanceof Error) {
      return createApiResponse(false, `Failed to set password: ${error.message}`, 500);
    }
    return createApiResponse(false, "Internal server error", 500);
  }
}
