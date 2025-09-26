import { Router } from "express";
import { createPost, deletePost, getSinglePost } from "../controllers/post.controller";
import userAuth from "../middlewares/userAuth";

const postRouter: Router = Router();

postRouter.post('/create', userAuth, createPost);
postRouter.get('/:id', userAuth, getSinglePost);
postRouter.post('/:id', userAuth, deletePost);


export default postRouter;