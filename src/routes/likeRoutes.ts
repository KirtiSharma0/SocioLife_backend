import { Router } from "express";
import userAuth from "../middlewares/userAuth";
import { HandleLike } from "../controllers/like.controller";

const likeRouter: Router = Router();
const handleLike = new HandleLike();

likeRouter.post('/likePost/:postId', userAuth, (req, res) => handleLike.likePost(req, res));
likeRouter.delete('/unlikePost/:postId', userAuth, (req, res) => handleLike.unLikePost(req, res));

export default likeRouter;