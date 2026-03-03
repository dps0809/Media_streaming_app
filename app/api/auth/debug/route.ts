import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          email: email.toLowerCase(),
        },
        { status: 404 }
      );
    }

    console.log("[DEBUG] User found:", user.email);
    console.log("[DEBUG] Stored password hash:", user.password);
    console.log("[DEBUG] Provided password:", password);
    console.log("[DEBUG] Hash length:", user.password.length);

    // Test bcrypt comparison
    const isValid = await bcrypt.compare(password, user.password);

    console.log("[DEBUG] bcrypt.compare result:", isValid);

    // Also test if we can hash the provided password and compare
    const manualHash = await bcrypt.hash(password, 10);
    console.log("[DEBUG] Manually hashed password:", manualHash);

    return NextResponse.json(
      {
        success: isValid,
        message: isValid ? "Password matches!" : "Password does not match",
        debug: {
          email: user.email,
          storedHashLength: user.password.length,
          providedPassword: password,
          providedPasswordLength: password.length,
          bcryptCompareResult: isValid,
          userRecord: {
            _id: user._id,
            email: user.email,
            user_name: user.user_name,
            passwordHash: user.password,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DEBUG ERROR]:", error);
    return NextResponse.json(
      {
        error: "Debug failed",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
