const jwt = require("jsonwebtoken");
const Admin = require("@models/admin.model.js");
const User = require("@models/user.model.js");
const protectRouting = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if (
        decodedToken.role === "admin" ||
        decodedToken.role === "super_admin"
      ) {
        const admin = await Admin.findById(decodedToken.id);
        if (admin) {
          next();
          return;
        }
      } else {
        const user = await User.findById(decodedToken.id);
        if (user) {
          console.log(user);
          next();
          return;
        }
      }
    }
    throw Error("unauthorized");
  } catch (err) {
    console.log(err);
    res.status(401).json({ message: "unauthorized" });
  }
};
module.exports = protectRouting;
