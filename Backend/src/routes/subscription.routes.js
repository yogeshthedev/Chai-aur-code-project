import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// Subscribers of a channel (public / optional auth)
router.get("/c/:channelId/subscribers", optionalVerifyJWT, getUserChannelSubscribers);

// Protected routes
router.post("/c/:channelId", verifyJWT, toggleSubscription);
router.get("/u/:subscriberId/subscriptions", verifyJWT, getSubscribedChannels);

export default router