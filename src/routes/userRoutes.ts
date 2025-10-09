import { Router } from "express";
import userAuth from "../middlewares/userAuth";
import { getProfile, updateProfile } from "../controllers/user.controller";

const userRouter: Router = Router();

userRouter.get('/:id', userAuth, getProfile);
userRouter.put('/updateProfile', userAuth, updateProfile);

export default userRouter;