import { Router } from 'express';
import {
    addVideoToPlaylist,
    createPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist,
} from "../controllers/playlist.controller.js"
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router();

// Public / Optional Auth Routes
router.route("/:playlistId").get(optionalVerifyJWT, getPlaylistById);
router.route("/user/:userId").get(optionalVerifyJWT, getUserPlaylists);

// Protected Mutation Routes
router.route("/").post(verifyJWT, createPlaylist);
router.route("/:playlistId").patch(verifyJWT, updatePlaylist).delete(verifyJWT, deletePlaylist);
router.route("/add/:videoId/:playlistId").patch(verifyJWT, addVideoToPlaylist);
router.route("/remove/:videoId/:playlistId").patch(verifyJWT, removeVideoFromPlaylist);

export default router