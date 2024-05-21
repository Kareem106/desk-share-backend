const { Router } = require("express");
const router = Router();
const multer = require("multer");
const upload = multer();
const protectRouting = require("@middlewares/protectRouting.middleware.js");
const {
  user_favorites_post,
  user_favorites_get,
  user_favorites_delete,
} = require("@controllers/user.controllers.js");
router.get("/", protectRouting, user_favorites_get);
router.post("/:id", protectRouting, user_favorites_post);
router.delete("/:id", protectRouting, user_favorites_delete);

module.exports = router;
