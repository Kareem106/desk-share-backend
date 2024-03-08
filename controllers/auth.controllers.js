const User = require("@models/user.model.js");
const jwt = require("jsonwebtoken");

//create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET, {
    expiresIn: "7d",
  });
};

//handle signup errors
const errHandler = (err) => {
  const errors = {};
  if (err.code === 11000) {
    errors.email = "email is already registered";
  } else {
    Object.values(err.errors).forEach((e) => {
      errors[e.path] = e.message;
    });
  }
  return errors;
};

const login_post = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.json({
      status: true,
      message: "logged in successfully",
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      status: false,
      message: "failed to login",
      error: err.message,
    });
  }
};

// signup request handler
const signup_post = async (req, res) => {
  try {
    const user = await User.create(req.body);
    const token = createToken(user._id);
    res.status(201).json({
      status: "true",
      message: "Account created",
      user: {
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (err) {
    const errors = errHandler(err);
    res.json({ status: "false", message: "failed", errors });
  }
};
module.exports = { login_post, signup_post };
