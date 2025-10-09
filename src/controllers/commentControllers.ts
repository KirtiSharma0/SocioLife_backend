 import { Request, Response } from "express";
import { IUser } from "../models/user";
import { Post } from "../models/post";
import Comment from "../models/comment";
import { uploadOnCloudinary } from "../utils/cloudinary";
import fs from 'fs'

export const addCommentOnPost = async (req: Request, res: Response) => {
    try {
        const { comment } = req.body as { comment: string };
        const { postId } = req.params;
        const { user } = (req as any) as { user: IUser };

        const post = await Post.findByIdAndUpdate(postId, {
            commentCount: { $inc: 1 }
        });

        if (!post) {
            res.status(404).json({
                success: false,
                message: "post not found"
            });
            return;
        }

        const file = req.files as Express.Multer.File | undefined;
        let fileDoc: string | null = null;
        if (file) {
            try {
                const url = await uploadOnCloudinary(file.path);
                await fs.promises.unlink(file.path);
                fileDoc = url;
            } catch (fileError) {
                console.error("Error processing file:", fileError);
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            }
        }

        const newComment = await Comment.create({
            user: user._id,
            post: post._id,
            text: comment
        });

        if (fileDoc) {
            newComment.mediaUrl = fileDoc;
            await newComment.save();
        }

        res.status(201).json({
            success: true,
            message: "commented successfully",
            data: newComment
        });
        return;

    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({
            success: false,
            message: "internal server error"
        });
        return;
    }
}