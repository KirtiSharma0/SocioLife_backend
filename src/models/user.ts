 import mongoose, { Types } from "mongoose";
import { UserRole } from "../types/user.types";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    userName: string;
    password: string;
    profilePic: string;
    bio?: string;
    role: UserRole;
    friendsCount: number;
    postCount: number;
    getJwt(): string
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    profilePic: {
        type: String,
        default: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQApAMBIgACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABgcDBAUBAv/EADkQAAICAQEEBggEBQUAAAAAAAABAgMEBQYRMUESIVFhccETIiOBkaGx0RQyQuFScnOS8RUzQ1Ni/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwC0gAaZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGO66qiqVt9ka648ZSe5Efy9r8KqTjjU2X/APr8ifx6/kBJAROvbSPS9pgNLtjbv8jtaZrmBqTUKLXG3/qsW6Xu5P3AdIAAAAAAAAAAAAAAAAAAAAAMOZlVYWNZkXy6NcFvb8l3mYhW22e7cyGDCXs6V0p7uc3y9y+pRyNY1bI1W9zubjWvyVJ9Ufu+80AAgepuLTi2muDT60eAuCbbLa+8trCzZL06Xs7H+tdj7/qSUqaqydNkbK5dGcGnFrkyz9LzFn4FGSkk7I75Jcpc18SK2gAQAAAAAAAAAAAAAAAAFxRVupXO/Ucq2X6rZbvDf1fItJcV4lVZsHXm5EHxjbNfNgrCADSAAAE32Ftc9NvqfX6O3q8Gv8kIJrsHFrByp8pWpL3L9yESYAEUAAAAAAAAAAAAAAAAK62oxni63f6vq2v0se9Pj895Ypw9qdJeo4itojvyaVvilxlHmvMCAA9aae5pprtPDSAAAFh7KY34bRKekt0rva/Hh8txD9B0meqZii01j1vfbLu7PFljxioxUYpJJbklyIsegAgAAAAAAAAAAAAAAAAAADkats9h6lJ2tOm98bIc/FcyO37H6hBv0N1Fse9uL+G7zJtdbVRHpX2Qrj2zkkc+zaDSq+qWbW/5d7+gEUjsnqsn+WiPjb9kzpYWxqi1LPyekt/XClbk/e/sdaO0mkN7vxaXjCS8jax9U0/Je6jLpk+zppMpjPjY9OLRGjGrjXXHhGKMoAAAEAAAAAAAAAAAAAAAOXr2s1aTQupTyJr2dfm+4Daz9QxtOp9Nl2dFPhFLfKXgiH6ltZmZDcMJLGr4dJdc37+RxMzLvzciV+VN2TlzfBLsXcYSlfVtk7puds5WTfGU22z5AKgGk+KAA3sDV8/Aa/D5Eugv+OXrR+DJXo+1OPluNWbGOPc+rpfol4dnvIMCKtvwBBdndop4LjjZsnPF4Rk+Nf7E5jKMoqUJKUZLemuDQHoAIAAAAAAAAAAA1dSza9PwrMm3hHhH+J8kVpm5V2blWZORLfZN73u5dy7jubZ6g8jOjiQfsqF6y7Zvj8PuR0oAAqAAAAAAAABK9jtYcJrTciXqS/2H2P8Ah+xFD2EpQkpwbUovemuTAtoGno+d/qOm05PV0pLdNLlJcTcMtAACAAAAAAY8i6OPRZdP8tcXJ+4yHJ2qtdWgZTj1OSjD4ySKK8ssndZO2x752ScpeL4nyAEAAUAAAAAAAAAABLNhMrdPJxG+p7rI/R+RLyu9krXVr2OlwsUov+1vyLEIoACAAAAAAHC2ze7Qp99sPqAUqAgAqAAAAAAAAAAAAADobO9WvYP9X7llgEIAAigAA//Z'
    },
    bio: {
        type: String,
        maxLength: 200
    },
    role: {
        type: String,
        enum: [UserRole.USER, UserRole.ADMIN],
        default: UserRole.USER
    },
    friendsCount: {
        type: Number,
        default: 0
    },
    postCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

userSchema.methods.getJwt = function () {
    const thisuser = this;
    const token = jwt.sign({ _id: thisuser._id }, process.env.JWT_SECRET!, {
        expiresIn: '7d'
    });
    return token;
}


export const User = mongoose.model<IUser>('userSchema', userSchema);