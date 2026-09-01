import { Router } from 'express';
import {
    addComment,
    deleteComment,
    getVideoComments,
    updateComment,
} from "../controllers/comment.controller.js"
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// Public route to get video comments
router.route("/:videoId").get(optionalVerifyJWT, getVideoComments);

// Protected routes (require auth)
router.route("/:videoId").post(verifyJWT, addComment);
router.route("/c/:commentId").delete(verifyJWT, deleteComment).patch(verifyJWT, updateComment);

export default router