 import { Router } from "express";
import { createPost, deletePost, getSinglePost } from "../controllers/post.controller";
import userAuth from "../middlewares/userAuth";
import { upload } from "../middlewares/multer";

const postRouter: Router = Router();

postRouter.post('/create', userAuth, upload.array("files", 10), createPost);
postRouter.get('/:id', userAuth, getSinglePost);
postRouter.post('/:id', userAuth, deletePost);


export default postRouter;