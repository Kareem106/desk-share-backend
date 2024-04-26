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
        req.body.admin = decodedToken.id;
      } else {
        req.body.user_id = decodedToken.id;
      }
      next();
      return;
    }
    throw Error("unauthorized");
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "unauthorized : don't have permission to access this route",
    });
  }
};
module.exports = protectRouting;
