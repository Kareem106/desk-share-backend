const { Router } = require("express");
const protectRouting = require("@middlewares/protectRouting.middleware.js");
const multer = require("multer");
const upload = multer();
const router = Router();
const {
  user_profile_put,
  user_profile_get,
} = require("@controllers/user.controllers.js");
router.get("/", protectRouting, user_profile_get);
router.put("/", [upload.none(), protectRouting], user_profile_put);
module.exports = router;
