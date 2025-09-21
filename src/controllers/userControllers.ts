 import { Request, Response } from 'express'
import { IUser, User } from '../models/user';
import { pick } from 'lodash';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({
                success: false,
                message: "id not present"
            });
            return;
        }
        const user: Partial<IUser> | null = await User.findById(id).select("userName profilePic bio private friendsCount postCount");

        if (!user) {
            res.status(404).json({
                success: false,
                message: 'user not found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "user fetched successfully",
            data: user
        });
        return;

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "internal server error"
        });
        return;
    }
}


export const updateProfile = async (req: Request, res: Response) => {
    try{
        const updatableFields = ["userName", "profilePic", "bio"];
        const { user } = (req as any) as { user: IUser};

        const updates = pick(req.body, updatableFields);

        const updatedUser = await User.findByIdAndUpdate(user._id, updates, {
            new: true,
            runValidators: true
        });

        if(!updatedUser){
            res.status(404).json({
                success: false,
                message: "user not found"
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "user updated successfully"
        });
        return;

    } catch(error){
        res.status(500).json({
            success: false,
            message: "internal server error"
        });
        return;
    }
}
