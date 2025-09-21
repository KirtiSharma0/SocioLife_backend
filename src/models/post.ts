 import mongoose, { Types, Document } from "mongoose";

export interface IPost extends Document {
    caption: string;
    date: Date;
    user: Types.ObjectId;
    images?: string;
    commentCount: number;
    likeCount: number;
}

const postSchema = new mongoose.Schema<IPost>(
    {
        caption: {
            type: String,
            minLength: 1,
            maxLength: 255,
            required: true,
        },
        date: {
            type: Date,
            default: new Date()
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        images: {
            type: [String],
            default: []
        },
        commentCount: {
            type: Number,
            default: 0,
        },
        likeCount: {
            type: Number,
            default: 0,
        }
    },
    { timestamps: true }
);

postSchema.index({ date: -1 });

export const Post = mongoose.model("Post", postSchema);