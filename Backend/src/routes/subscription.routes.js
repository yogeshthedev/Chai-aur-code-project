import { Router } from 'express';
import {
    getSubscribedChannels,
    getUserChannelSubscribers,
    toggleSubscription,
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.post("/c/:channelId", toggleSubscription);

// subscribers of a channel
router.get("/c/:channelId/subscribers", getUserChannelSubscribers);

// channels a user is subscribed to
router.get("/u/:subscriberId/subscriptions", getSubscribedChannels);

export default router