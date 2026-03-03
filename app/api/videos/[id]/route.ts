import { dbConnect } from "@/lib/dbConnect";
import video from "@/models/video";
import { createApiResponse } from "@/types/apiresponse";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return createApiResponse(false, "Invalid video ID", 400);
    }

    await dbConnect();
    const found = await video.findById(id).lean();

    if (!found) {
      return createApiResponse(false, "Video not found", 404);
    }

    return NextResponse.json(found);
  } catch (error) {
    console.error("Error fetching video:", error);
    return createApiResponse(false, "Failed to fetch video", 500);
  }
}
