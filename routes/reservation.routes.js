const { Router } = require("express");
const multer = require("multer");
const upload = multer();
const router = Router();
const {
  user_reservation_post,
  user_reservation_get,
} = require("@controllers/reservation.controllers.js");
router.get("/", user_reservation_get);
router.post("/", upload.none(), user_reservation_post);
module.exports = router;
