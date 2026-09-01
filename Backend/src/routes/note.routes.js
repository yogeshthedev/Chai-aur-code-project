import { Router } from "express";
import {
  createNote,
  getVideoNotes,
  updateNote,
  deleteNote,
  exportNotes,
} from "../controllers/note.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All note routes require user authentication
router.use(verifyJWT);

router.route("/").post(createNote);
router.route("/v/:videoId").get(getVideoNotes);
router.route("/v/:videoId/export").get(exportNotes);
router.route("/:noteId").patch(updateNote).delete(deleteNote);

export default router;
