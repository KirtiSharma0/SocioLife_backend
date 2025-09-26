import { Request, Response } from "express";
import { IUser } from "../models/user";
import fs from 'fs'
import { uploadOnCloudinary } from "../utils/cloudinary";
import { IPost, Post } from "../models/post";

export const createPost = async (req: Request, res: Response) => {
    try {
        const { user } = (req as any) as { user: IUser };
        const { caption } = req.body as { caption: string };

        if (!caption || caption.trim().length === 0) {
            res.status(400).json({
                success: false,
                message: "caption cant be empty"
            });
            return;
        }

        const files = req.files as Express.Multer.File[] | undefined;
        const fileDocs: string[] = [];
        if (files?.length) {
            for (const file of files) {
                try {
                    const url = await uploadOnCloudinary(file.path);
                    await fs.promises.unlink(file.path);
                    fileDocs.push(url);
                } catch (fileError) {
                    console.error("Error processing file:", fileError);
                    if (fs.existsSync(file.path)) {
                        fs.unlinkSync(file.path);
                    }
                }
            }
        }

        const newPost: IPost = await Post.create({
            user: user._id,
            images: fileDocs,
            caption
        });

        res.status(200).json({
            success: true,
            message: "post created successfully",
            data: newPost
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


export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                message: "id not present"
            });
            return;
        }

        const deletedPost: IPost | null = await Post.findByIdAndDelete(id);
        if (!deletedPost) {
            res.status(404).json({
                success: false,
                message: "post not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "post deleted successfully",
            data: deletedPost
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


export const getSinglePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                message: "id not present"
            });
            return;
        }

        const post: IPost | null = await Post.findById(id).lean();

        if (!post) {
            res.status(404).json({
                success: false,
                message: "post not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "post fetched successfully",
            data: post
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


export const getUserPost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { page, limit } = req.query;

        if (!id) {
            res.status(400).json({
                success: false,
                message: "id not present"
            });
            return;
        }

        const skip = (Number(page) - 1) * Number(limit);

        const posts: IPost[] = await Post.find({ user: id }).skip(skip).limit(Number(limit)).lean();

        res.status(200).json({
            success: true,
            message: "posts fetched successfully",
            data: posts
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