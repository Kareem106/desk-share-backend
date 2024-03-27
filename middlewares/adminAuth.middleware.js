const jwt = require("jsonwebtoken");
const Admin = require("@models/admin.model.js");
const adminAuth = async (req, res, next) => {
  const token = req.headers["authorization"];
  try {
    if (token) {
      const admin = await jwt.verify(
        token,
        process.env.SECRET,
        async function (err, decordedToken) {
          if (
            !err &&
            (decordedToken.role === "admin" ||
              decordedToken.role === "super_admin")
          ) {
            const admin = await Admin.findById(decordedToken.id);
            return admin;
          }
        }
      );
      if (admin) {
        req.body.admin = admin._id;
        next();
        return;
      }
    }
    throw Error();
  } catch (err) {
    res.status(401).json({ message: "unautharized" });
  }
};

module.exports = adminAuth;
