require("module-alias/register");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const Country = require("@models/country.model.js");
const authRoute = require("@routes/auth.routes.js");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose
  .connect(process.env.DB_URL)
  .then((res) => {
    console.log("Conneted to Database");
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => console.log(err));

app;
app.use("/auth", authRoute);
// app.get("/country", async (req, res) => {
//   try {
//     // await Country.findById("65e9b518583cfabbd459bfe3")
//     //   .then((res) => console.log(res))
//     //   .catch((err) => console.log(err));
//     await Country.create({ name: "egypt" })
//       .then((res) => console.log(res))
//       .catch((err) => console.log(err));
//   } catch (err) {
//     console.log(err);
//   }
// });
