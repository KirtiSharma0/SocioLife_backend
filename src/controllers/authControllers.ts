 import z from "zod";
import { IUser, User } from "../models/user";
import { comparePassword, hashPassword } from "../utils/password";
import { zodLoginSchema } from "../zod/signin.zod";
import { signupSchema } from "../zod/signup.zod"
import { Request, Response } from "express";

export const signUp = async (req: Request, res: Response) => {
    try {
        const signUpData = signupSchema.parse(req.body);

        const existingUser = await User.findOne({ email: signUpData.email });

        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "user already exist"
            });
            return;
        }
        const { password } = signUpData;
        const hashedPassword: string = await hashPassword(password);
        signUpData.password = hashedPassword;

        const newUser = new User(signUpData);
        await newUser.save();

        const token: string = newUser.getJwt();
        res.cookie("token", token);

        res.status(201).json({
            success: true,
            message: "user successfully created",
            data: newUser
        });
        return;


    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                message: "invalid data",
            });
        }
        res.status(500).json({
            success: false,
            message: "something went wrong",
        });
        return;
    }
}