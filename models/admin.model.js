const mongoose = require("mongoose");
const WorkSpace = require("@models/workspace.model.js");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const adminSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  email: {
    type: String,
    unique: [true, "email is already registerd"],
    required: [true, "email is required"],
    lowercase: true,
    validate: [isEmail, "email is not valid"],
  },
  password: {
    type: String,
    required: [true, "please enter a password"],
    minlength: [6, "minimum password length is 6"],
  },
  role: {
    type: String,
    required: [true, "admin role is required"],
  },
  workspaces: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
});
adminSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

adminSchema.statics.login = async function (email, password) {
  const admin = await this.findOne({ email });
  if (admin) {
    const auth = await bcrypt.compare(password, admin.password);
    if (auth) {
      return admin;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

const Admin = mongoose.model("admins", adminSchema);
module.exports = Admin;
