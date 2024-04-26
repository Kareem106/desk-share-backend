const jwt = require("jsonwebtoken");
const apiAuth = async (req, res, next) => {
  const token = req.headers["x-api-key"];
  // if (token) {
  //   jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
  //     if (err) {
  //       console.log(err.message);
  //       res.status(401).json({ message: "unautharized" });
  //     } else {
  //       if (decodedToken.api_key === (process.env.API_KEY || "API-KEY")) {
  //         console.log("authorized");
  //         next();
  //       } else {
  //         res.status(401).json({ message: "unautharized" });
  //       }
  //     }
  //   });
  // } else {
  //   res.status(401).json({ message: "unautharized" });
  // }
  try {
    if (token) {
      const decodedToken = jwt.verify(token, process.env.SECRET);
      if(decodedToken.api_key === process.env.API_KEY){
        next();
        return;
      }
    }
    throw Error();
  } catch (err) {
    res.status(401).json({ message: "unautharized : invalid api key" });
  }
};
module.exports = apiAuth;
