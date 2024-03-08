require("module-alias/register");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Country = require("@models/country.model.js");
const authRoute = require("@routes/auth.routes.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(
    process.env.DB_URL ||
      "mongodb+srv://admin:L8op2Lvy3MuuO6FS@deskshare.tiecuf2.mongodb.net/deskshare"
  )
  .then((res) => {
    console.log("Conneted to Database");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));

app;
app.use("/auth", authRoute);
