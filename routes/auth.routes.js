const { Router } = require("express");
const multer = require("multer");
const upload = multer();
const { signup_post, login_post } = require("@controllers/auth.controllers.js");
const route = Router();
route.post("/login", upload.none(), login_post);
route.post("/signup", upload.none(), signup_post);
module.exports = route;
