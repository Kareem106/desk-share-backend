require("module-alias/register");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const mongoose = require("mongoose");
const apiAuth = require("@middlewares/apiAuth.middleware.js");
const app = express();
const authRoute = require("@routes/auth.routes.js");
const profileRoute = require("@routes/profile.routes.js");
const favoritesRoute = require("@routes/favorites.routes.js");
const apiRoute = require("@routes/api.routes.js");
const adminRoute = require("@routes/admin.routes.js");
const workspaceRoute = require("@routes/workspace.routes.js");
const reservationRoute = require("@routes/reservation.routes.js");
const protectRouting = require("@middlewares/protectRouting.middleware.js");
const corsOpt = {
  origin: "*",
};
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(helmet());
app.use(cors(corsOpt));
// let imagekit = new ImageKit({
//   publicKey: "public_bdusYXMWygCXpmEalTE0+M1MJxY=",
//   privateKey: "private_LOSe7q4gDxiFIV1RxivqmRyUQwo=",
//   urlEndpoint: "https://ik.imagekit.io/co5deypud/deskshare",
// });

mongoose
  .connect(process.env.DB_URL || "mongodb://localhost:27017/")
  .then((res) => {
    console.log("Conneted to Database");
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));

app.use(apiAuth);
app.use("/auth", authRoute);
app.use("/profile", profileRoute);
app.use("/favorites", favoritesRoute);
app.use("/api", apiRoute);
app.use("/workspaces", protectRouting, workspaceRoute);
app.use("/admin", adminRoute);
app.use("/reservations", protectRouting, reservationRoute);

//dropbox
// app.post("/upload", upload.single("file"), async (req, res) => {
//   const file = req.file;
//   const url = "https://content.dropboxapi.com/2/files/upload";
//   const authToken =
//     "sl.BxUkJViE2IS5H5mwzlPhJUwnRGyf8RqwrbG9ak7YdwnGNyTMs2KrrPMqsVz81u7L6HalHwnzRWoCW0mHnjR3BO8_-0usy2dcmiMBVKirL9ZJnifBNHd2kEkfIELgPA786NCYOkyvo-tk";
//   const headers = {
//     Authorization: `Bearer ${authToken}`,
//     "Content-Type": "application/octet-stream",
//     "Dropbox-API-Arg": JSON.stringify({
//       path: "/workspace/avatar6.jpg",
//       mode: { ".tag": "add" },
//       autorename: false,
//       mute: true,
//     }),
//   };

//   const response = await axios.post(url, file.buffer, { headers });

//   console.log("File uploaded successfully:", response.data);
//   res.json({ message: "uploaded" });
// });

//imagekit
// app.post("/upload", upload.single("file"), async (req, res) => {
//   const file = req.file;
//   imagekit.upload(
//     {
//       file: file.buffer, //required
//       fileName: file.originalname, //required
//       tags: ["tag1", "tag2"],
//     },
//     function (error, result) {
//       if (error) console.log(error);
//       else console.log(result);
//     }
//   );
//   res.json("uploaded");
// });
// app.get("/updates", (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Connection", "keep-alive");
//   const interval = setInterval(() => {
//     const date = new Date();
//     res.write(date);
//   }, 1000);
//   res.on("close", () => {
//     console.log("connection closed");
//     res.end();
//   });
// });
