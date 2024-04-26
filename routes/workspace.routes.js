const { Router } = require("express");
const router = Router();
const {
  workspaces_get,
  workspace_details,
} = require("@controllers/workspace.controllers.js");
router.get("/", workspaces_get);
router.get("/:id", workspace_details);
module.exports = router;
