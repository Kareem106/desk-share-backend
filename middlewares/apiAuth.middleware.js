const jwt = require("jsonwebtoken");
const apiAuth = (req, res, next) => {
  const token = req.headers["x-api-key"];
  if (token) {
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.json({ message: "unautharized" });
      } else {
        if (decodedToken.api_key === (process.env.API_KEY || "API-KEY")) {
          console.log("authorized");
          next();
        } else {
          res.json({ message: "unautharized" });
        }
      }
    });
  } else {
    res.json({ message: "unautharized" });
  }
};
module.exports = apiAuth;
