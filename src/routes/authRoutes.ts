 import { Router } from "express";
import { signUp, signIn, logout } from "../controllers/auth.controller";

const authRouter: Router = Router();

authRouter.post('/signup', signUp);
authRouter.post('/signin', signIn);
authRouter.post('/logout', logout);

export default authRouter;