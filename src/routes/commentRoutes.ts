 import { Router } from "express";
import userAuth from "../middlewares/userAuth";
import { upload } from "../middlewares/multer";
import { addCommentOnPost } from "../controllers/comment.controller";

const commentRouter: Router = Router();

commentRouter.post('/commentOnPost/:postId', userAuth, upload.array("files", 10), addCommentOnPost);

export default commentRouter;