const { Router } = require("express");
const adminAuth = require("@middlewares/adminAuth.middleware.js");
const protectRouting = require("@middlewares/protectRouting.middleware.js");
const multer = require("multer");
const upload = multer();
const router = Router();
const {
  workspaces_get,
  workspace_details,
} = require("@controllers/workspace.controllers.js");
router.get("/", protectRouting, workspaces_get);
router.get("/:id", protectRouting, workspace_details);
module.exports = router;
