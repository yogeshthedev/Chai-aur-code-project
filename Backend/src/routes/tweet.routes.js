import { Router } from 'express';
import {
    createTweet,
    deleteTweet,
    getUserTweets,
    updateTweet,
} from "../controllers/tweet.controller.js"
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// Public / Optional Auth Routes
router.route("/user/:userId").get(optionalVerifyJWT, getUserTweets);

// Protected Routes
router.route("/").post(verifyJWT, createTweet);
router.route("/:tweetId").patch(verifyJWT, updateTweet).delete(verifyJWT, deleteTweet);

export default router