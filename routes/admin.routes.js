const multer = require("multer");
const upload = multer();
const { Router } = require("express");
const adminAuth = require("@middlewares/adminAuth.middleware.js");
const {
  admin_signup_post,
  admin_login_post,
  admin_workspaces_post,
  admin_workspaces_get,
  admin_workspace_details,
  admin_workspace_cover_post,
} = require("@controllers/admin.controllers.js");
const router = Router();
router.post("/login", upload.none(), admin_login_post);
router.post("/signup", upload.none(), admin_signup_post);
router.get("/workspaces", adminAuth, admin_workspaces_get);
router.get("/workspaces/:id", adminAuth, admin_workspace_details);
router.post("/workspaces", [upload.none(), adminAuth], admin_workspaces_post);
router.post(
  "/workspaces/:id/cover",
  [upload.single("file"), adminAuth],
  admin_workspace_cover_post
);
module.exports = router;
