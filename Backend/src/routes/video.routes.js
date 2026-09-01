import { Router } from "express";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
  updateVideoChapters,
} from "../controllers/video.controller.js";
import { optionalVerifyJWT, verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public / Optional Auth Routes
router.route("/").get(optionalVerifyJWT, getAllVideos);
router.route("/:videoId").get(optionalVerifyJWT, getVideoById);

// Protected Routes (Require Authentication)
router.route("/").post(
  verifyJWT,
  upload.fields([
    {
      name: "video",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  publishAVideo
);

router
  .route("/:videoId")
  .delete(verifyJWT, deleteVideo)
  .patch(
    verifyJWT,
    upload.fields([
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    updateVideo
  );

router.route("/:videoId/chapters").patch(verifyJWT, updateVideoChapters);
router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);

export default router;
