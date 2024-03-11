require("module-alias/register");
const express = require("express");
const mongoose = require("mongoose");
const apiAuth = require("@middlewares/apiAuth.middleware.js");
const app = express();
const authRoute = require("@routes/auth.routes.js");
const apiRoute = require("@routes/api.routes.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.DB_URL || "mongodb://localhost:27017/")
  .then((res) => {
    console.log("Conneted to Database");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));

app.use(apiAuth);
app.use("/auth", authRoute);
app.use("/api", apiRoute);
