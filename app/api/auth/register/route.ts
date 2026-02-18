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

        await dbConnect();
        const user = await User.findOne({email});
        if(user){
            return createApiResponse(false, "User already exists", 400);
        }
        const hashedPassword = await bcrypt.hash(password, 10);  
        const newUser = await User.create({email,password:hashedPassword,user_name});
        return createApiResponse(true, "User created successfully", 201, {user: newUser});
    } catch (error) {
        return createApiResponse(false, "Internal server error", 500);
    }
}