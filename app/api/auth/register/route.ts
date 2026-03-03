import { NextRequest , NextResponse} from "next/server";
import {dbConnect} from "@/lib/dbConnect";
import User from "@/models/user";
import {createApiResponse} from "@/types/apiresponse";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest){
    try {
        const {email,password,user_name} = await request.json();
        if(!email || !password || !user_name){
            return createApiResponse(false, "All fields are required", 400);
        }

        // Basic validation
        if (password.length < 6) {
            return createApiResponse(false, "Password must be at least 6 characters long", 400);
        }

        if (!email.includes("@")) {
            return createApiResponse(false, "Please provide a valid email", 400);
        }

        await dbConnect();
        
        // Normalize email to lowercase
        const normalizedEmail = email.toLowerCase();
        
        // Check if user already exists
        const existingUser = await User.findOne({email: normalizedEmail});
        if(existingUser){
            return createApiResponse(false, "User already exists", 400);
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user with normalized email
        const newUser = await User.create({
          email: normalizedEmail,
          password: hashedPassword,
          user_name,
          provider: "credentials",
        });
        
        return createApiResponse(true, "User created successfully", 201, {user: newUser});
    } catch (error) {
        console.error("Registration error:", error);
        if (error instanceof Error) {
            return createApiResponse(false, `Registration failed: ${error.message}`, 500);
        }
        return createApiResponse(false, "Internal server error", 500);
    }
}