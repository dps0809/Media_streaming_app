import mongoose, { model } from "mongoose";

export const video_dimensions = {
    width :1080,
    height :1920
} as const;

export interface IVideo{
    _id?: string | mongoose.Types.ObjectId;
    title: string;
    description: string;
    video_url: string;
    thumbnail_url: string;
    controls?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    transformations?: {
        width: number;
        height: number;
        quality?: number;
    }
}

const videoSchema = new mongoose.Schema<IVideo>({ 
    title: {type: String, required: true},
    description: {type: String, required: true},
    video_url: {type: String, required: true},
    thumbnail_url: {type: String, required: true},
    controls: {type: Boolean, default: true},
    transformations: {
        width: {type: Number, default: video_dimensions.width},
        height: {type: Number, default: video_dimensions.height},
        quality: {type: Number, default: 100}
    }
},{timestamps:true})

const video =mongoose.models.Video || model<IVideo>("Video",videoSchema);

export default video;