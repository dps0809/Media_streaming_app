import { dbConnect } from "@/lib/dbConnect";
import video, { IVideo } from "@/models/video";
import { createApiResponse } from "@/types/apiresponse";
import { NextResponse ,NextRequest} from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";

export async function GET() {
    try {
        await dbConnect();
        const videos = await video.find().sort({ createdAt: -1 }).lean();
        return NextResponse.json(videos || []);
    }
    catch (error) {
        console.error("Error fetching videos:", error);
        return createApiResponse(false, "Failed to fetch videos", 500);
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return createApiResponse(false, "Unauthorized user", 401);
        }
        await dbConnect();
        const body: IVideo = await request.json();
        
        if(!body.title || !body.description || !body.video_url || !body.thumbnail_url) {
            return createApiResponse(false, "Missing required fields", 400);
        }

        const videoData ={
            ...body,
            controls: body.controls !== undefined ? body.controls : true,
            transformation:{
                width :1080,
                height :1920,
                quality :body.transformations?.quality || 100
            }
        }
        const newVideo = await video.create(videoData);
        createApiResponse(true, "Video created successfully", 201, newVideo);
        return NextResponse.json(newVideo);
    }   
    catch (error) {
        console.error("Error creating video:", error);
        return createApiResponse(false, "Failed to create video", 500);
    }
}
